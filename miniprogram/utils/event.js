class Event {
  /** on 方法把订阅者所想要订阅的事件及相应的回调函数
   * 记录在 Event 对象的 cbs 属性中并调用 */
  on(event, fn) {
    if (typeof fn !== 'function') {
      // eslint-disable-next-line no-console
      console.error('fn must be a function');
      return;
    }
    this.cbs = this.cbs || {};
    this.data = this.data || {};
    (this.cbs[event] = this.cbs[event] || []).push(fn);
    if (this.data[event]) {
      fn(this.data[event]);
    }
  }

  /** emit 方法接受一个事件名称参数，
   * 在 Event 对象的 cbs 属性中取出对应的数组，
   * 并逐个执行里面的回调函数 */
  emit(event, data) {
    this.cbs = this.cbs || {};
    this.data = this.data || {};
    this.data[event] = data;
    const callbacks = this.cbs[event];
    callbacks?.forEach((callback) => {
      callback(data);
    });
  }

  /** off 方法接受事件名称和当初注册的回调函数作参数，
   * 在 Event 对象的 cbs 属性中删除对应的回调函数。 */
  off(event, fn) {
    this.cbs = this.cbs || {};
    this.data = this.data || {};
    // all
    if (!arguments.length) {
      delete this.cbs;
      delete this.data;
      return;
    }
    if (arguments.length === 1) {
      if (this.cbs[event]) delete this.cbs[event];
      if (this.data[event]) delete this.data[event];
      return;
    }
    if (arguments.length === 2) {
      const data = this.data[event];
      if (!data) return;
      const callbacks = this.cbs[event];
      if (!callbacks) return;

      for (let i = 0, len = callbacks.length; i < len; i += 1) {
        const cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
    }
  }
}
export default Event;
