const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config(); // .env 파일을 읽어서 process.env 로 만듬
const pageRouter = require("./routes/page"); // 라우터 가져오기

const app = express();
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html"); // 애플리케이션의 뷰 엔진을 설정
nunjucks.configure("views", {
  // nunjucks 설정
  express: app,
  watch: true,
});

app.use(morgan("dev")); // 로그를 출력해주는 미들웨어
app.use(express.static(path.join(__dirname, "public"))); // 정적 파일 제공
app.use(express.json()); // json 형식의 데이터를 받아올 수 있게 해줌
app.use(express.urlencoded({ extended: false })); // form 형식의 데이터를 받아올 수 있게 해줌
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 파싱해주는 미들웨어
app.use(
  // 세션을 사용할 수 있게 해주는 미들웨어
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", pageRouter);

app.use((req, res, next) => {
  // 404 처리 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
