export default class PriorityQueue {
  // Public methods
  constructor() {
    this.queue = []
    this.set = new Set();
  }
  isEmpty() {
    return this.length() == 0;
  }
  length() {
    return this.queue.length;
  }
  insert(element, priority) {
    if (this.set.has(element)) {
      for (let i = 0; i < this.length(); i++) {
        if (this.queue[i].element === element) {
          this.queue[i].priority += priority;
          this.bubbleUp(i);
        }
      }
    } else {
      this.set.add(element);
      this.queue.push({ 
        element: element, 
        priority: priority 
      });
      this.bubbleUp(this.queue.length - 1);
    }
  }
  extract() {
    if (this.isEmpty()) {
      return null;
    } 
    // remove the element
    const extracted = this.queue[0].element;
    this.set.delete(extracted);
    
    if (this.length() == 1) {
      return this.queue.pop().element;
    }
    
    // Heapify 
    this.queue[0] = this.queue.pop();
    this.bubbleDown(0);
    
    return extracted;
  }
  convertToArray() {
    const array = [];
    while (!this.isEmpty()) {
      array.push(this.extract());
    }
    return array;
  }

  // Private methods
  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.queue[parent].priority >= this.queue[index].priority) {
        break;
      }
      [this.queue[parent], this.queue[index]] = [this.queue[index], this.queue[parent]];
      index = parent;
    }
  }
  bubbleDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let maxIndex = index;

    if (left < this.queue.length && this.queue[left].priority > this.queue[maxIndex].priority) {
      maxIndex = left;
    }

    if (right < this.queue.length && this.queue[right].priority > this.queue[maxIndex].priority) {
      maxIndex = right;
    }

    if (index !== maxIndex) {
      [this.queue[index], this.queue[maxIndex]] = [this.queue[maxIndex], this.queue[index]];
      this.bubbleDown(maxIndex);
    }
  }
}