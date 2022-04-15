import Mock from 'mockjs'
interface Data {
  id?: string | number,
  title?: string,
  images?: string | Array<string>,
  author?: string,
  token?: string
}

const bannerData: Array<Data> = [
  {
    "id": "1",
    "images": "./2021-02-27/1.jpg",
    "title": ""
  },
  {
    "id": "15",
    "title": "爱笑",
    "images": "./2021-02-27/15.jpg",
  },
]

const newsData: Array<Data> = [
  {
    "id": "1",
    "images": ["../assets/logo.png"],
    "title": "金发碧眼为什么很少在白人以外的种族出现？",
    "author": "作者 / biokiwi"
  },
  {
    "id": "2",
    "title": "《哈利波特》原著中与电影中人物有哪些差别？",
    "author": "作者 / kalinnn",
    "images": ["../assets/logo.png"]
  },
  {
    "id": "3",
    "title": "有哪些适合情侣两个人一起玩的桌游？",
    "author": "作者 / 北邙",
    "images": ["../assets/logo.png"]
  }
]

const loginData: Data = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInVzZXJfaWQiOjEsImlhdCI6MTU5NDI2MjQ5NSwiZXhwIjoxNTk0MzQ4ODk1fQ.1MJ_MAFgpBjOjpggj69Xz8F_evBcMAenRK_7a8fdVrc"
}

Mock.mock('/api/bannerList', 'get', {
  "data": bannerData
})

Mock.mock('/api/newsList', 'get', {
  "data": newsData
})


Mock.mock('/api/login', 'post', {
  "data": loginData
})