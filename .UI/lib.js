class PostsList { //объект для работы с массивом photoPosts

  _postsColl = new Map() //коллекция постов

  _notValid = [] //массив постов, не прошедших валидацию

  constructor(coll) { //конструктор, создает коллекцию на основе массива постов
    this._addAll(coll);
  }

  static _validate(obj = {}) { //проверяет пост на присутствие всех обязательных полей в нужном формате
    if (!obj.hasOwnProperty("description") || !obj.hasOwnProperty("author")) return false;
    let keys = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== "id" && keys[i] !== "author" && keys[i] !== "createdAt" && keys[i] !== "description"
        && keys[i] !== "photoLink" && keys[i] !== "hashTags" && keys[i] !== "likes") {
        return false;
      }
    }
    return (typeof obj.description == "string" && typeof obj.author == "string" && obj.createdAt instanceof Date);
  }

  _addAll(coll) { //добавляет посты из массива в коллекцию
    for (let i = 0; i < coll.length; i++) {
      if (PostsList._validate(coll[i])) { //валидация поста перед добавлением в коллекцию
        this._postsColl.set(coll[i]["id"], coll[i]);
      }
      else {
        this._notValid.push(coll[i]);
      }
    }
    return this._notValid;
  }

  filter(author, createdAt, hashTags) {
    let postsArr = [];

    if (author !== "all" || createdAt !== "all" || hashTags !== 'all') {
      if (author !== "all" && createdAt === undefined && hashTags === undefined) { //фильтрация по автору
        for(let elem of this._postsColl.values()) {
          if (elem.author === author) {
            postsArr.push(elem);
          }
        }
      } else if (createdAt !== "all" && author === undefined && hashTags === undefined) { //фильтрация по дате
        for(let elem of this._postsColl.values()) {
          if (elem.createdAt.getTime() === createdAt.getTime()) {
            postsArr.push(elem);
          }
        }
      } else if (hashTags !== "all" && author === undefined && createdAt === undefined) { //фильтрация по хэштегу
        for(let elem of this._postsColl.values()) {
          if (elem.hashTags.length > 0 && elem.hashTags.includes(hashTags)) {
            postsArr.push(elem);
          }
        }
      } else if (author !== "all" && createdAt !== "all" && hashTags === undefined) { //фильтрация по автору и дате
        for(let elem of this._postsColl.values()) {
          if (elem.author === author && elem.createdAt.getTime() === createdAt.getTime()) {
            postsArr.push(elem);
          }
        }
      } else if (author !== "all" && hashTags !== "all" && hashTags === undefined) { //фильтрация по автору и хэштегу
        for(let elem of this._postsColl.values()) {
          if (elem.hashTags.length > 0 && elem.hashTags.includes(hashTags) && elem.author === author) {
            postsArr.push(elem);
          }
        }
      } else if (hashTags !== "all" && createdAt !== "all" && author === undefined) { //фильтрация по хэштегу и дате
        for(let elem of this._postsColl.values()) {
          if (elem.hashTags.length > 0 && elem.hashTags.includes(hashTags)
            && elem.createdAt.getTime() === createdAt.getTime()) {
            postsArr.push(elem);
          }
        }
      } else { //фильтрация по автору, дате и хэштегу
        for(let elem of this._postsColl.values()) {
          if (elem.author === author && elem.hashTags.length > 0 && elem.hashTags.includes(hashTags)
            && elem.createdAt.getTime() === createdAt.getTime()) {
            postsArr.push(elem);
          }
        }
      }
    }
    return postsArr;
  }

  getPage(skip, top, filterConfig) { //получение постов
    let postsArr = []; //массив из коллекции, используется для фильрации и сортировки
    for(let elem of this._postsColl.values()) { //создает массив из коллекции
      postsArr.push(elem);
    }
    if ((skip === undefined) || (skip > postsArr.length)) {
      skip = 0;
    }
    if ((top === undefined) || (top > postsArr.length)) {
      top = 10;
    }
    if (filterConfig === undefined) {
      return postsArr.sort(function(a,b){
        return b.createdAt > a.createdAt ? 1 : -1;}).slice(skip, skip + top);
    }
    else {
      let keys = Object.getOwnPropertyNames(filterConfig);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "hashTags" && keys[i] !== "author" && keys[i] !== "createdAt") {
          return false;
        }
      }

      try {
        postsArr = this.filter(filterConfig.author, filterConfig.createdAt, filterConfig.hashTags);
      }
      catch {
        return "Invalid data!";
      }

      if (postsArr.length === 0) { //если постов выбрано не было, запускает метод getPosts() со значениями по умолчанию
        return "Sorry, there are no such posts! :(";
      }
      //сортировка по дате и выбор заданного количества постов
      return postsArr.sort(function (a, b) {
        return b.createdAt > a.createdAt ? 1 : -1;}).slice(skip, skip + top);
    }
  }

  get(id) { //получает пост с определенным id
    if (this._postsColl.get(id)) {
      return this._postsColl.get(id);
    }
    else {
      return false;
    }
  }

  add(obj = {}) { //добавляет новый пост
    if (PostsList._validate(obj)) { //валидация поста перед добавлением
      obj.id = this._postsColl.size + 1;
      if (!obj.hasOwnProperty("createdAt")) {
        obj.createdAt = new Date();
      }
      if (!obj.hasOwnProperty("photoLink")) {
        obj.photoLink = '';
      }
      if (!obj.hasOwnProperty("hashTags")) {
        obj.hashTags = [];
      }
      obj.likes = [];
      let oldLength = this._postsColl.size; // сохранение старой длины массива для проверки, был ли довавлен пост
      this._postsColl.set(obj.id, obj); //добавление поста в массив
      let newLength = this._postsColl.size;
      return newLength > oldLength; //проверка, был ли довавлен пост в массив, если да, то возвращает true, иначе возвращает false
    }
    else {
      return false;
    }
  }

  edit(id, obj = {}) { //изменяет пост с указанным id
    if (!(Object.keys(obj).length === 0 || obj.hasOwnProperty("id") || obj.hasOwnProperty("createdAt")
      || obj.hasOwnProperty("author") || !this.get(id))) {
      let post = this.get(id);
      let keysObj = Object.keys(obj); //получает список полей объекта, переданного методу для замены поста
      try { //вносит изменеия в пост, если сделать этого не удалось, возвращает false
        for (let i = 0; i < keysObj.length; i++) {
          post[keysObj[i]] = obj[keysObj[i]];
        }
      } catch {
        return false;
      }
      if (PostsList._validate(post)) { //валидация поста перед изменением массива
        this.remove(id); //удаляет прежнюю версию поста
        if (this._postsColl.set(id, post)) { //добавляет новую версию поста; проверяет, был ли заменен пост в массиве, если да, то возвращает true, иначе возвращает false
          return true;
        } else {
          return false;
        }
      }
    }
    else {
      return false;
    }
  }

  remove(id) { //удаление поста по id
    return this._postsColl.delete(id);
  }
}



class View {

  _formatDate(date) {
    let str = "";
    (date.getDate() < 10) ? str = "0" + date.getDate() : str = "" + date.getDate();
    (date.getMonth() < 9) ? str += ".0" + (date.getMonth()+1) : str += "." + (date.getMonth()+1);
    return str += "." + date.getFullYear();
  }

  _formatTime(date) {
    let str = "";
    (date.getHours() < 10) ? str = "0" + date.getHours() : str = "" + date.getHours();
    (date.getMinutes() < 10) ? str += ":0" + date.getMinutes() : str += ":" + date.getMinutes();
    return str;
  }

  feed(user = "") {
    let elem = document.querySelector(".posts-feed");
    let postsArr = posts.getPage();
    let str = "";
    for (let i = 0; i < postsArr.length; i++) {
      let article = document.createElement("article");
      str = "<div class='container'><h3>" + postsArr[i].author + "</h3><div><p>" +
        this._formatTime(postsArr[i].createdAt) + " </p><p>" + this._formatDate(postsArr[i].createdAt) +
        "</p></div></div>";

      str += "<p class='text'>" + postsArr[i].description + "</p>";

      if (postsArr[i].hashTags.length > 0) {
        str += "<p class='text'>" + postsArr[i].hashTags + "</p>";
      }

      if (postsArr[i].photoLink !== '') {
        str += "<img src='" + postsArr[i].photoLink+ "'>";
      }

      if (user === postsArr[i].author) {
        str += "<div class='featuresContainer'><div class='container2, features'><a>редактировать</a>" +
        "<button>удалить</button></div><h3 class='myLike'><i>" + postsArr[i].likes.length + "</i> &#10084</h3></div>";
      }
      else {
        str += "<button class='like'><h3><i>" + postsArr[i].likes.length + "</i> &#10084</h3></button>";
      }
      article.innerHTML = str;
      elem.appendChild(article);
    }
  }

  showElements(user = "") {
    let elem = document.getElementById("headerDiv");
    let str = "";

    if (user !== "") {
      str += "<div><h2>" + user + "</h2><div class='container2'><a class='addPostLink'>Добавить пост</a>" +
        "<h3>|</h3><a class='exit'>Выйти</a></div></div>";
    }
    else {
      str += "<div class='authorization'><h2>Авторизация</h2></div>";
    }

    elem.innerHTML = str;
  }
}

function login(name = "") {

  user = name;

  document.querySelector(".posts-feed").innerHTML = "";

  view.showElements(user); //показывает элементы, доступные, если пользователь авторизован
  view.feed(user); //отображает ленту фотопостов
}

function addPost(obj = {}) { //добавляет пост и отображает его в списке в браузере

  posts.add(obj);

  login(user);
}

function editPost(id, obj = {}) { //изменяет пост в массиве и изменяет его отображение в списке в браузере

  posts.edit(id, obj);

  login(user);
}

function removePost(id) { //удаляет пост из массива и из списка в браузере

  posts.remove(id);

  login(user);
}
