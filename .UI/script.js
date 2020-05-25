let user = "Koi";

let posts = new PostsList(allPosts); //создание экземпляра класса Posts

let view = new View(); //создание экземпляра класса View

login(user); //устанавливает пользователя, загружает летну постов, показывает элементы, доступные, если пользователь авторизован

// addPost({description: 'Принимаем новеньких в ролевую!!', createdAt: new Date('2020-02-23T23:00:00'),
//   author: 'Анечка', hashTags: ['#ролевая']}); //добавление поста

// editPost('5', {description: 'Обращайся!',
//   photoLink: 'https://www.meme-arsenal.com/memes/91b217dfcf2099b29fbfe64e84ad17cc.jpg', likes: ['Иисус']}); //редактирование поста

// removePost('4'); //удаление поста
