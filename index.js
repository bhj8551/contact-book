// index.js

// module가져오기
let express = require('express');
let mongoose = require('mongoose');
let app = express();

// DB setting 거의 고정
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// 환경변수에 저장한 DB connection string 불러오기, DB 연결
mongoose.connect(process.env.MONGO_DB);

// DB object 넣기, DB와 관련된 이벤트 리스너 함수 포함
let db = mongoose.connection;

// DB연결은 앱 실행 시 단 한 번만 일어나는 이벤트여서 once사용
db.once('open', () => {
  console.log('DB connected');
});

db.on('error', err => {
  console.log('DB ERROR:', err);
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

let port = 3000;
app.listen(port, () => {
  console.log('server on! http://localhost:'+port);
});
