
import { Problem } from './types';

// A subset of LeetCode Hot 100 for demonstration
export const HOT_100: Problem[] = [
  { id: 1, frontendId: "1", title: "两数之和", titleSlug: "two-sum", difficulty: "Easy", tags: ["Array", "Hash Table"] },
  { id: 2, frontendId: "2", title: "两数相加", titleSlug: "add-two-numbers", difficulty: "Medium", tags: ["Linked List", "Math", "Recursion"] },
  { id: 3, frontendId: "3", title: "无重复字符的最长子串", titleSlug: "longest-substring-without-repeating-characters", difficulty: "Medium", tags: ["Hash Table", "String", "Sliding Window"] },
  { id: 4, frontendId: "4", title: "寻找两个正序数组的中位数", titleSlug: "median-of-two-sorted-arrays", difficulty: "Hard", tags: ["Array", "Binary Search", "Divide and Conquer"] },
  { id: 5, frontendId: "5", title: "最长回文子串", titleSlug: "longest-palindromic-substring", difficulty: "Medium", tags: ["String", "Dynamic Programming"] },
  { id: 11, frontendId: "11", title: "盛最多水的容器", titleSlug: "container-with-most-water", difficulty: "Medium", tags: ["Array", "Two Pointers", "Greedy"] },
  { id: 15, frontendId: "15", title: "三数之和", titleSlug: "3sum", difficulty: "Medium", tags: ["Array", "Two Pointers", "Sorting"] },
  { id: 20, frontendId: "20", title: "有效的括号", titleSlug: "valid-parentheses", difficulty: "Easy", tags: ["Stack", "String"] },
  { id: 21, frontendId: "21", title: "合并两个有序链表", titleSlug: "merge-two-sorted-lists", difficulty: "Easy", tags: ["Linked List", "Recursion"] },
  { id: 42, frontendId: "42", title: "接雨水", titleSlug: "trapping-rain-water", difficulty: "Hard", tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"] },
  { id: 70, frontendId: "70", title: "爬楼梯", titleSlug: "climbing-stairs", difficulty: "Easy", tags: ["Math", "Dynamic Programming", "Memoization"] },
  { id: 94, frontendId: "94", title: "二叉树的中序遍历", titleSlug: "binary-tree-inorder-traversal", difficulty: "Easy", tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"] },
  { id: 101, frontendId: "101", title: "对称二叉树", titleSlug: "symmetric-tree", difficulty: "Easy", tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"] },
  { id: 121, frontendId: "121", title: "买卖股票的最佳时机", titleSlug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", tags: ["Array", "Dynamic Programming"] },
  { id: 141, frontendId: "141", title: "环形链表", titleSlug: "linked-list-cycle", difficulty: "Easy", tags: ["Hash Table", "Linked List", "Two Pointers"] },
  { id: 206, frontendId: "206", title: "反转链表", titleSlug: "reverse-linked-list", difficulty: "Easy", tags: ["Linked List", "Recursion"] },
  { id: 234, frontendId: "234", title: "回文链表", titleSlug: "palindrome-linked-list", difficulty: "Easy", tags: ["Linked List", "Two Pointers", "Stack", "Recursion"] },
  { id: 300, frontendId: "300", title: "最长递增子序列", titleSlug: "longest-increasing-subsequence", difficulty: "Medium", tags: ["Array", "Binary Search", "Dynamic Programming"] },
];

export const DIFFICULTY_COLORS = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};
