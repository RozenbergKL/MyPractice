let posts = new PostsList(allPosts);

console.log('Newest 10 posts: ');
console.log(posts.getPage(0, 10));
console.log('Previous newest 10 posts, if there are: ');
console.log(posts.getPage(10, 10));

console.log('Posts with hashtag "#игры_в_классику": ');
console.log(posts.getPage(0, 10, {hashTags: '#игры_в_классику'}));
console.log('Posts with several parameters: ');
console.log(posts.getPage(0, 10, {author: 'Kellein',
  createdAt: new Date('2019-12-21T12:43:00')}));
console.log('Posts with invalid data: ');
console.log(posts.getPage(0, 10, {author: 'Kellein-Mei',
  createdAt: new Date('2019-12-21T12:43:00'), createdAt: 'yes'}));

console.log('Post #2: ');
console.log(posts.get('2'));
console.log('Post #30: ');
console.log(posts.get('30'));

console.log('Adding post with valid data: ');
console.log(posts.add({description: 'Принимаем новеньких в ролевую!!', createdAt: new Date('2020-02-23T23:00:00'),
  author: 'Анечка', hashTags: ['#ролевая']}));
console.log('Adding post with invalid data: ');
console.log(posts.add({description: 'Принимаем новеньких в ролевую!!', createdAt: new Date('2020-02-23T23:00:00')}));

console.log('Editing post with valid data: ')
console.log(posts.edit('5', {description: 'Обращайся!',
  photoLink: 'https://www.meme-arsenal.com/memes/91b217dfcf2099b29fbfe64e84ad17cc.jpg', likes: 'Иисус'}));
console.log('Editing post with invalid data: ')
console.log(posts.edit('2', {description: 'Принимаем новеньких в ролевую!!',
  createdAt: new Date('2019-02-23T23:00:00'), author: 'Анечка'})); //изменить пост в массиве photoPosts по id

console.log('Removing post with valid data: ')
console.log(posts.remove('4'));
console.log('Removing post with invalid data: ')
console.log(posts.remove(5));

console.log(posts._postsColl); //вывод массива фотопостов
console.log(posts.getPage(0, 10));
