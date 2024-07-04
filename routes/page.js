const express = require("express");
const {
  renderProfile,
  renderJoin,
  renderMain,
} = require("../controllers/page");

const router = express.Router(); // 라우터 객체 생성

// res.locals 에 담아두면 공통으로 사용할 수 있음
router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
});

router.get("/profile", renderProfile); // GET /profile 요청이 들어오면 renderProfile 함수 실행
router.get("/join", renderJoin);
router.get("/", renderMain);

module.exports = router;
