
// 生年月日を定数として設定
const birthdate = new Date('2001-08-15');

// 生年月日を表示
// document.getElementById('birthdateDisplay').textContent = `生年月日: ${birthdate.toLocaleDateString('ja-JP')}`;

// 年齢計算関数
function calculateAge(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    // 生まれた月がまだ来ていない場合、年齢を1つ減らす
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    return age;
}

// 年齢を計算して表示
const age = calculateAge(birthdate);
document.getElementById('ageDisplay').textContent = `${age}歳。`;
