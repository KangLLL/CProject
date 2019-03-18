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
  }
}