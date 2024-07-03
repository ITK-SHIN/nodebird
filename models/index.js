// Sequelize 모델을 연결하고, 모델 간의 관계를 설정하는 파일
const Sequelize = require("sequelize");
const User = require("./user");
const Post = require("./post");
const Hashtag = require("./hashtag");
const env = process.env.NODE_ENV || "development"; // NODE_ENV 환경 변수가 설정되어 있지 않으면 development 모드로 설정
const config = require(__dirname + "/../config/config.json")[env]; // config.json 파일에서 development 항목을 불러옴 (config.json 파일은 데이터베이스 설정을 담고 있음)

const db = {};

let sequelize;
if (config.use_env_variable) {
  // use_env_variable이 설정되어 있으면 환경변수로 연결
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.sequelize = sequelize; // 연결 객체 저장 (다른 파일에서 db 객체를 불러와 사용할 수 있게 함)
db.User = User; // User 모델을 db 객체에 연결
db.Post = Post; // Post 모델을 db 객체에 연결
db.Hashtag = Hashtag;

User.initiate(sequelize); // User 모델과 시퀄라이즈 연결
Post.initiate(sequelize);
Hashtag.initiate(sequelize);

User.associate(db); // User 모델과 다른 모델 간의 관계 설정
Post.associate(db); // Post 모델과 다른 모델 간의 관계 설정 (다른 모델과의 관계가 없으면 비워둠)
Hashtag.associate(db);

module.exports = db;
