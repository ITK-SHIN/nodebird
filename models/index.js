// Sequelize 모델을 연결하고, 모델 간의 관계를 설정하는 파일
const Sequelize = require("sequelize");
const fs = require("fs"); // 파일 시스템 모듈
const path = require("path");
const env = process.env.NODE_ENV || "development"; // NODE_ENV 환경 변수가 설정되어 있지 않으면 development 모드로 설정
const config = require(__dirname + "/../config/config.json")[env]; // config.json 파일에서 development 항목을 불러옴 (config.json 파일은 데이터베이스 설정을 담고 있음)

const db = {};

let sequelize;
if (config.use_env_variable) {
  // use_env_variable :  환경변수를 사용할 때 설정
  // use_env_variable이 설정되어 있으면 환경변수로 연결
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database, //   데이터베이스 이름
    config.username, // 유저 이름
    config.password, // 비밀번호
    config //  config.json 파일에서 불러온 설정
  );
}

const basename = path.basename(__filename); // 현재 파일명을 가져옴
fs.readdirSync(__dirname) // models 폴더의 파일들을 읽어옴  // __dirname : 현재 폴더
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    ); // 파일명이 .으로 시작하지 않고, 현재 파일명과 같지 않으며, .js로 끝나는 파일을 필터링
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)); // 파일을 불러옴 (User, Post, Hashtag 모델)
    console.log(file, model.name); // 파일명과 모델명을 출력
    db[model.name] = model; // db 객체에 모델을 연결
    model.initiate(sequelize); // 각 모델에 시퀄라이즈 객체를 연결
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
