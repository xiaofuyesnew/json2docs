/**
 * 验证工具函数
 */

/**
 * 检查值是否为空
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim() === ''
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

/**
 * 验证对象是否包含必需的字段
 * @param {object} obj - 要验证的对象
 * @param {string[]} requiredFields - 必需的字段列表
 * @returns {string[]} 缺失的字段列表
 */
export function validateRequiredFields(obj, requiredFields) {
  if (!obj || typeof obj !== 'object') {
    return requiredFields
  }

  return requiredFields.filter(field => isEmpty(obj[field]))
}

/**
 * 验证值是否为指定类型
 * @param {*} value - 要验证的值
 * @param {string} type - 期望的类型
 * @returns {boolean} 是否为指定类型
 */
export function validateType(value, type) {
  if (type === 'array') {
    return Array.isArray(value)
  }

  if (type === 'object') {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  return (typeof value === 'string' && type === 'string')
    || (typeof value === 'number' && type === 'number')
    || (typeof value === 'boolean' && type === 'boolean')
    || (typeof value === 'function' && type === 'function')
    || (typeof value === 'undefined' && type === 'undefined')
}

/**
 * 验证值是否在允许的值列表中
 * @param {*} value - 要验证的值
 * @param {Array} allowedValues - 允许的值列表
 * @returns {boolean} 是否在允许的值列表中
 */
export function validateEnum(value, allowedValues) {
  return allowedValues.includes(value)
}
