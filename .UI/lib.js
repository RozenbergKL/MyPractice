;(function () {
  let postLib = {};

  postLib.showAllPosts = function (arr) {
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i].id + "\n" + arr[i].author + "\n" + arr[i].createdAt + "\n"
        + arr[i].description + "\n" + arr[i].hashTags + "\n" + arr[i].photoLink + "\n" + arr[i].likes);
    }
  }

  postLib.getPosts = function (skip, top, filterConfig) {
    let postsArr = allPosts;
    if ((skip === undefined) || (skip > allPosts.length)) {
      skip = 0;
    }
    if ((top === undefined) || (top > allPosts.length)) {
      top = 10;
    }
    if (filterConfig === undefined) {
      return allPosts.sort(function(a,b){
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
        if (filterConfig.author !== "all" || filterConfig.createdAt !== "all" || filterConfig.hashTags !== 'all') {
          if (filterConfig.author !== "all" && filterConfig.createdAt === undefined
            && filterConfig.hashTags === undefined) { //фильтрация по автору
            postsArr = allPosts.filter(function (pst) {
              return pst.author === filterConfig.author
            });
          } else if (filterConfig.createdAt !== "all" && filterConfig.author === undefined
            && filterConfig.hashTags === undefined) { //фильтрация по дате
            postsArr = allPosts.filter(function (pst) {
              return pst.createdAt.getTime() ===
                filterConfig.createdAt.getTime()
            });
          } else if (filterConfig.hashTags !== "all" && filterConfig.author === undefined
            && filterConfig.createdAt === undefined) { //фильтрация по хэштегу
            postsArr = allPosts.filter(function (pst) {
              if (pst.hashTags !== null) {
                return pst.hashTags.includes(filterConfig.hashTags)
              }
            });
          } else if (filterConfig.author !== "all" && filterConfig.createdAt !== "all"
            && filterConfig.hashTags === undefined) { //фильтрация по автору и дате
            postsArr = allPosts.filter(function (pst) {
              return pst.author === filterConfig.author &&
                pst.createdAt.getTime() === filterConfig.createdAt.getTime()
            });
          } else if (filterConfig.author !== "all" && filterConfig.hashTags !== "all"
            && filterConfig.hashTags === undefined) { //фильтрация по дате и хэштегу
            postsArr = allPosts.filter(function (pst) {
              return pst.author === filterConfig.author &&
                pst.hashTags.includes(filterConfig.hashTags)
            });
          } else if (filterConfig.hashTags !== "all" && filterConfig.createdAt !== "all"
            && filterConfig.author === undefined) { //фильтрация по хэштегу и дате
            postsArr = allPosts.filter(function (pst) {
              return pst.hashTags.includes(filterConfig.hashTags)
                && pst.createdAt.getTime() === filterConfig.createdAt.getTime()
            });
          } else { //фильтрация по автору, дате и хэштегу
            postsArr = allPosts.filter(function (pst) {
              return pst.author === filterConfig.author &&
                pst.createdAt.getTime() === filterConfig.createdAt.getTime() &&
                pst.hashTags.includes(filterConfig.hashTags)
            });
          }
        }
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

  postLib.getPost = function (id) {
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].id === id) {
        return allPosts[i];
      }
    }
    return false;
  }

  postLib.validatePost = function(obj = {}) { //проверяет пост на присутствие всех обязательных полей в нужном формате
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

  postLib.addPost = function (obj = {}) {
    if (this.validatePost(obj)) { //валидация поста перед добавлением
      obj.id = count + 1;

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

      let oldLength = allPosts.length; // сохранение старой длины массива для проверки, был ли довавлен пост

      let newLength = allPosts.push(obj); //добавление поста в массив

      return newLength > oldLength; //проверка, был ли довавлен пост в массив, если да, то возвращает true, иначе возвращает false
    }
    else {
      return false;
    }
  }

  postLib.editPost = function (id, obj = {}) {
    if (!(Object.keys(obj).length === 0 || obj.hasOwnProperty("id") || obj.hasOwnProperty("createdAt")
      || obj.hasOwnProperty("author") || !this.getPost(id))) {
      let post = this.getPost(id);
      let index = allPosts.indexOf(post); //получает индекс поста в массиве
      let keysObj = Object.keys(obj); //получает список полей объекта, переданного методу для замены поста
      try { //вносит изменеия в пост, если сделать этого не удалось, возвращает false
        for (let i = 0; i < keysObj.length; i++) {
          post[keysObj[i]] = obj[keysObj[i]];
        }
      } catch {
        return false;
      }
      if (this.validatePost(post)) { //валидация поста перед изменением массива
        let edit = allPosts.splice(index, 1, post) //замена поста в массиве новым
        if (!edit) { //проверка, был ли заменен пост в массиве, если да, то возвращает true, иначе возвращает false
          return edit;
        }
        else {
          return true;
        }
      }
    }
    else {
      return false;
    }
  }

  postLib.removePost = function (id) {
    let post = this.getPost(id); //получает пост из массива
    if (!post) return post; //если поста, соответсвующего заданному id, нет, возвращает false
    let index = allPosts.indexOf(post); //получает индекс поста в массиве
    let remove = allPosts.splice(index, 1); //удаляет пост из массива
    if (!remove) { //проверка, был ли удален пост, если да, то возвращает true, иначе возвращает false
      return remove;
    }
    else {
      return true;
    }
  }

  window.postLib = postLib;
}());
