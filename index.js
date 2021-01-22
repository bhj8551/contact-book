// index.js

// module가져오기
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let app = express();

// DB setting 거의 고정
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
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

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

// json 형식의 데이터를 받는다
// form에 입력한 데이터가 bodyParser를 통해 req.body로 생성된다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// _method의 query로 들어오는 값으로 HTTP method를 바꾼다.
app.use(methodOverride('_method'));

// DB schema
let contactSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  email: {type: String},
  phone: {type: String},
});
// model 만들기
let Contact = mongoose.model('contact', contactSchema);

// route 설정
// Home
app.get('/', (req, res) => {
  res.redirect('/contacts');
});
// Contacts - index
app.get('/contacts', (req, res) => {
  Contact.find({}, (err, contacts) => {
    if(err) return res.json(err);
    res.render('contacts/index', {contacts});
  });
});
// Contacts - New
 app.get('/contacts/new', (req, res) => {
   res.render('contacts/new');
 })
// Contacts - create
app.post('/contacts', (req, res) => {
  Contact.create(req.body, (err, contact) => {
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});
// Contacts - show
app.get('/contacts/:id', (req, res) => {
  Contact.findOne({_id:req.params.id}, (err, contact) => {
    if(err) return res.json(err);
    res.render('contacts/show', {contact:contact});
  });
});
// Contacts - edit
app.get('/contacts/:id/edit', (req, res) => {
  Contact.findOne({_id:req.params.id}, (err, contact) => {
    if(err) return res.json(err);
    res.render('contacts/edit', {contact:contact});
  });
});
// Contacts - update
app.put('/contacts/:id', (req, res) => {
  Contact.findOneAndUpdate({_id:req.params.id}, req.body, (err, contact) => {
    if(err) return res.json(err);
    res.redirect('/contacts/'+req.params.id);
  });
});

app.delete('/contacts/:id', (req, res) => {
  Contact.deleteOne({_id:req.params.id}, (err) => {
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

let port = 3000;
app.listen(port, () => {
  console.log('server on! http://localhost:'+port);
});
