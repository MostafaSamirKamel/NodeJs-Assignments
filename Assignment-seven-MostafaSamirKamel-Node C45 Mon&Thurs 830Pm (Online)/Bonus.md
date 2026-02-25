# 🧩 LeetCode Bonus: Remove Element
---

## 💻 Solution Implementation

```javascript

var removeElement = function (nums, val) {
  let k = 0; 

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k;
};
```

---

![Bonus Visualization](/bonus.png)


