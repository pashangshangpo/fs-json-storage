const Storage = require('../dist/fs-json-storage')

const storage = Storage('./demo/storage')

// storage.set('message', 'hello')
// storage.set('name', 'zhangsan')
// storage.set('hello', 'world')

// storage.get().then(console.log)
// storage.get('name').then(console.log)
// storage.get('aaa').then(console.log)

// storage.remove('name').then(console.log)

// storage.remove().then(console.log)

// storage.empty().then(console.log)

// storage.set({
//   number: 2,
//   test: 1,
// })

// storage.add({
//   title: 'hello',
//   content: 'body',
// })

// storage.add(
//   {
//     title: 'hello3',
//     content: 'body3',
//   },
//   {
//     title: 'hello4',
//     content: 'body4',
//   }
// )

// storage.set(0, {
//   title: 'hello1',
//   content: 'body1'
// })

// storage.get().then(console.log)

storage.find(items => items.title.includes('hello')).then(console.log)
