module.exports = {
  editDistance: (name, keyword) => {
    var dp = [0];
    for (i = 1; i <= name.length; i++) {
      dp[i] = i;
    }

    for (i = 1; i <= keyword.length; i++) {
      var prev = dp[0];
      dp[0] = i;
      for (j = 1; j <= name.length; j++) {
        var temp = dp[j];
        if (name.charAt(j - 1) == keyword.charAt(i - 1)) {
          dp[j] = prev;
        }
        else {
          dp[j] = Math.min((prev + 1), Math.min(dp[j] + 1, dp[j - 1] + 1));
        }
        prev = temp;
      }
    }

    return dp[name.length];
  },

  knapsack: (weight, list) => {
    var recur = (w, l, memo, back) => {
      if (w == 0) return 0;
      if (memo[w]) return memo[w];
      var result = 0;
      for (var i = 0; i < l.length; i++) {
        if (w >= l[i].weight) {
          result = Math.max(result, recur(w - l[i].weight, l, memo, back) + l[i].value);
          back[w] = i;
        }
      }
      memo[w] = result;
      return result;
    };

    var backlist = {};
    recur(weight, list, {}, backlist);

    var w = weight;
    var result = {};
    while (w in backlist) {
      result[backlist[w]] = (result[backlist[w]] || 0) + 1;
      w -= list[backlist[w]].weight;
    }
    return result;
  }
}