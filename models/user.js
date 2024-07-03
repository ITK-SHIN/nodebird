const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    // 테이블 설정
    User.init(
      // 테이블 컬럼 설정
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, // null 허용
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"), // ENUM: 문자열 중 하나를 선택
          allowNull: false,
          defaultValue: "local", // 기본값 설정
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        // 테이블 자체에 대한 설정
        sequelize,
        timestamps: true, // true -> createdAt, updatedAt 컬럼을 추가
        underscored: false, // false -> 카멜 케이스로 컬럼명을 변경 (기본값 : false)
        modelName: "User", // 모델 이름 설정
        tableName: "users", // 실제 데이터베이스의 테이블 이름
        paranoid: true, // true -> deletedAt 컬럼을 추가
        charset: "utf8", // 한글 설정
        collate: "utf8_general_ci", // 한글 설정
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post); // User 모델과 Post 모델은 1:N 관계
    db.User.belongsToMany(db.User, {
      // User 모델과 User 모델은 N:M 관계
      foreignKey: "followingId", // followingId 컬럼이 생성됨
      as: "Followers", // 팔로워 목록
      through: "Follow", // Follow 테이블을 통해 연결
    });

    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings", // 팔로잉 목록
      through: "Follow", // Follow 테이블을 통해 연결
    });
  } // 다른 모델과의 관계를 적을 수 있음
}

module.exports = User;
