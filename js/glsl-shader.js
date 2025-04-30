function initWebGL() {
    const canvas = document.getElementById('glcanvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Vertex Shader
    const vertexShaderSource = `
precision highp float;
attribute float vertexId;
attribute float vertexCount;
uniform float time;
uniform vec2 resolution;
varying vec4 v_color;

#define PI radians(180.)

mat4 persp(float fov, float aspect, float zNear, float zFar) {
    float f = tan(PI * 0.5 - 0.5 * fov);
    float rangeInv = 1.0 / (zNear - zFar);
    
    return mat4(
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (zNear + zFar) * rangeInv, -1,
        0, 0, zNear * zFar * rangeInv * 2.0, 0);
}

mat4 rotY(float angleInRadians) {
    float s = sin(angleInRadians);
    float c = cos(angleInRadians);
    
    return mat4( 
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1);  
}

float anim(float t) {
    float st = sin(t);
    return (sign(st) * (1.0 - pow(1.0 - abs(st), 5.0))) * 0.5 + 0.5;
}

vec3 SampleSpherePos(float idx, float num) {
    idx += 0.5;
    float phi = 10.166407384630519631619018026484 * idx;
    float th_cs = 1.0 - 2.0 * idx / num;
    float th_sn = sqrt(clamp(1.0 - th_cs * th_cs, 0.0, 1.0));
    return vec3(cos(phi) * th_sn, sin(phi) * th_sn, th_cs);
}

vec3 SampleCubePos(float idx, float num) {
    float side = floor(pow(num, 1.0 / 3.0) + 0.5);
    vec3 res;
    res.x = mod(idx, side);
    res.y = floor(mod(idx, side * side) / side);
    res.z = floor(mod(idx, side * side * side) / side / side);
    res -= vec3(side * 0.5);
    res *= 1.5 / side;
    return res;
}

void main() {
    vec3 samplePos = mix(SampleCubePos(vertexId, vertexCount), SampleSpherePos(vertexId, vertexCount), anim(time));
    
    vec4 vertPos = rotY(time * 0.1) * vec4(samplePos, 1.0) + vec4(0, 0, -3.0, 0);
    
    gl_Position = persp(PI * 0.25, resolution.x / resolution.y, 0.1, 100.0) * vertPos;
    gl_PointSize = 3.0; 

    v_color = vec4(1, 1, 1, 1);
}

    `;

    // Fragment Shader
    const fragmentShaderSource = `
        precision mediump float;
        varying vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `;

    // シェーダーのコンパイル
    const compileShader = (source, type) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    // シェーダープログラムの作成
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('ERROR linking shader program:', gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.useProgram(shaderProgram);

    // データの定義
    const vertexCount = 1000;
    const vertexIds = new Float32Array(vertexCount);
    for (let i = 0; i < vertexCount; i++) {
        vertexIds[i] = i;
    }

    // バッファの作成とデータのバインド
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexIds, gl.STATIC_DRAW);

    // 属性とユニフォームの位置を取得
    const a_vertexId = gl.getAttribLocation(shaderProgram, 'vertexId');
    const a_vertexCount = gl.getAttribLocation(shaderProgram, 'vertexCount');
    const u_time = gl.getUniformLocation(shaderProgram, 'time');
    const u_resolution = gl.getUniformLocation(shaderProgram, 'resolution');

    // 属性の有効化とバインド
    gl.vertexAttribPointer(a_vertexId, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_vertexId);
    gl.vertexAttrib1f(a_vertexCount, vertexCount);

    // キャンバスのサイズを調整し、ユニフォームの値を設定
    gl.uniform2f(u_resolution, canvas.width, canvas.height);

    function render(time) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(u_time, time * 0.001);
        gl.drawArrays(gl.POINTS, 0, vertexCount);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

window.onload = initWebGL;
