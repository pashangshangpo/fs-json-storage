import fs from 'fs-promise/dist/fs-promise.js'

/**
 * 储存类
 * @param {String} storagePath 文件路径
 */
const Storage = storagePath => {
  // set列表，防止连续set导致数据互相覆盖
  const sets = []
  const adds = []
  let isSeted = false
  let isAdded = false

  const getStorage = async () => {
    const isExists = await fs.exists(storagePath)

    if (isExists) {
      return fs.readJson(storagePath)
    }

    return null
  }

  const saveStorage = storage => {
    return fs.writeJson(storagePath, storage)
  }

  /**
   * 获取数据
   * @param {String} key 键，可选，不写获取全部
   * @returns {Object|Array|Null}
   */
  const get = async key => {
    const storage = await getStorage()

    if (!storage) {
      return null
    }

    if (key != null) {
      return storage[key] || null
    }

    return storage
  }
  
  /**
   * 替换键数据或添加数据，传递对象则覆盖整个数据
   * @param  {...any} args key,value|{}
   */
  const set = async (...args) => {
    if (isSeted) {
      sets.unshift(set.bind(null, ...args))
      return
    }

    isSeted = true

    let storage = await getStorage()

    storage = storage || {}

    if (args.length === 2) {
      storage[args[0]] = args[1]
    } else if (args.length === 1) {
      const isObject = Object.prototype.toString.call(args[0]).toLowerCase() === '[object object]'
      
      if (isObject) {
        storage = args[0]
      }
    } else {
      for (let item of args) {
        const [key, value] = item

        storage[key] = value
      }
    }

    const res = await saveStorage(storage)

    isSeted = false

    if (sets.length) {
      sets.pop()()
    }

    return res
  }

  /**
   * 向数组添加数据
   * @param  {...any} args {}|[...{}]
   */
  const add = async (...args) => {
    if (isAdded) {
      adds.unshift(add.bind(null, ...args))
      return
    }

    isAdded = true

    let storage = await getStorage()

    if (!storage) {
      storage = []
    }

    storage.push(...args)

    const res = await saveStorage(storage)

    isAdded = false

    if (adds.length) {
      adds.pop()()
    }

    return res
  }

  /**
   * 删除指定键下的数据
   * @param {String} key 键，可选，不写删除所有数据
   */
  const remove = async key => {
    const storage = await getStorage()

    if (!storage) {
      return
    }

    if (!key) {
      return fs.deleteFile(storagePath)
    }

    delete storage[key]

    return saveStorage(storage)
  }

  /**
   * 清空数据
   */
  const empty = () => {
    return fs.deleteFile(storagePath)
  }

  /**
   * 查找符合条件的数组数据
   * @param {Function} func 过滤数据方法
   * @returns {Array} Promise
   */
  const find = async func => {
    const storage = await getStorage()

    if (!storage || !Array.isArray(storage)) {
      return []
    }

    return storage.filter(func)
  }

  return {
    get,
    set,
    add,
    remove,
    empty,
    find,
  }
}

export default Storage
