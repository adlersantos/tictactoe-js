function TTT() {
  this.player = 'X';
  this.board = this.makeBoard();
}

TTT.prototype.boardFull = function() {
  return _.every(this.board, function (row) {
    return _.every(row, function(el) { return el !== null; });
  });
};

TTT.prototype.calculateAIMove = function() {
  var game = this;

  if (this.board[1][1] === 'X' && this.cornersEmpty()) {
    return [0, 0];
  } else if (this.board[1][1] === null) {
    return [1, 1];
  } else if (this.edgeCase('X')) {
    return [2, 0];
  }

  return (
    this.winningMove('O')
    || this.winningMove('X')
    || this.triangulation('X')
    || this.winnableLine('O')
    || this.emptyTiles()[Math.floor(Math.random() * this.emptyTiles.length)]
  );
};

TTT.prototype.columns = function() {
  var game = this;
  var columns = [];
  var indices = _.range(0, 3);
  _.each(indices, function (i) {
    var column = [];
    _.each(indices, function (j) {column.push(game.board[j][i])});
    columns.push(column);
  });
  return columns;
};

TTT.prototype.cornersEmpty = function () {
  var board = this.board;

  var corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
  return _.every(corners, function (corner) {
    return _.isNull(board[corner[0]][corner[1]]);
  });
};

TTT.prototype.edgeCase = function(symbol) {
  var game = this;
  var count = 0;
  _.each([1, 2], function (i) {
    if (game.board[i][i] === symbol) {
      count += 1;
    }
  });
  if (count === 2 && game.emptyTiles().length === 6) {
    return true;
  }
};

TTT.prototype.diagonals = function() {
  var board = this.board;
  var diagonals = [];
  diagonals.push([board[0][0], board[1][1], board[2][2]]);
  diagonals.push([board[0][2], board[1][1], board[2][0]]);
  return diagonals;
};

TTT.prototype.diagonalWinner = function () {
  var game = this;

  var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
  var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

  var winner = null;
  _.each(["X", "O"], function (mark) {
    function didWinDiagonal (diagonalPositions) {
      return _.every(diagonalPositions, function (pos) {
        return game.board[pos[0]][pos[1]] === mark;
      });
    }

    var won = _.any(
      [diagonalPositions1, diagonalPositions2],
      didWinDiagonal
    );

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

TTT.prototype.emptyTiles = function () {
  var game = this;
  var emptyPositions = [];
  var indices = _.range(0, 3);
  _.each(indices, function (i) {
    _.each(indices, function (j) {
      if (game.board[i][j] === null) {
        emptyPositions.push([i, j]);
      }
    });
  });
  return emptyPositions;
}

TTT.prototype.hasPair = function (arr, symbol) {
  var nullCount = _.filter(arr, _.isNull).length;
  var symbolCount = _.filter(arr, function(el) { return el === symbol; }).length;
  if ( nullCount === 1 && symbolCount === 2) {
    return true;
  } else {
    return false;
  }
};

TTT.prototype.hasOne = function(arr, symbol) {
  if ( _.filter(arr, _.isNull).length === 2 && _.filter(arr, function(el) { return el === symbol; }).length === 1) {
    return true;
  } else {
    return false;
  }
};

TTT.prototype.horizontalWinner = function () {
  var game = this;

  var winner = null;
  _(["X", "O"]).each(function (mark) {
    var indices = _.range(0, 3);

    var won = _(indices).any(function (i) {
      return _(indices).every(function (j) {
        return game.board[i][j] === mark;
      });
    });

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

TTT.prototype.makeBoard = function () {
  return _.times(3, function (i) {
    return _.times(3, function (j) {
      return null;
    });
  });
};

TTT.prototype.placeMark = function (pos) {
  this.board[pos[0]][pos[1]] = this.player;
};

TTT.prototype.rows = function() {
  var game = this;
  var rows = [];
  var indices = _.range(0, 3);
  _.each(indices, function (i) {
    var row = [];
    _.each(indices, function (j) {row.push(game.board[i][j])});
    rows.push(row);
  });
  return rows;
};

TTT.prototype.squareCorners = function () {
  return [[0, 0], [0, 1], [1, 0], [1, 1]];
};

TTT.prototype.switchPlayer = function () {
  (this.player === 'X') ? (this.player = 'O') : (this.player = 'X');
};

TTT.prototype.triangles = function() {
  var triangles = [
    [[0, 0], [1, 1], [2, 0]],
    [[0, 0], [1, 1], [0, 2]],
    [[2, 2], [1, 1], [2, 0]],
    [[2, 2], [1, 1], [0, 2]],
  ]
  _.each(this.squareCorners(), function (corner) {
    triangles.push([corner, corner.sumWith(1, 0), corner.sumWith(0, 1)]);
    triangles.push([corner, corner.sumWith(0, 1), corner.sumWith(1, 1)]);
    triangles.push([corner, corner.sumWith(1, 0), corner.sumWith(1, 1)]);
    triangles.push([corner.sumWith(0, 1), corner.sumWith(1, 1), corner.sumWith(1, 0)]);
  })

  return triangles;
};

TTT.prototype.triangulation = function(symbol) {
  var defensivePosition;
  var game = this;

  game.triangles().forEach(function (triangle) {
    var elements = _.map(triangle, function(pos) {
      return game.board[pos[0]][pos[1]];
    });

    if (game.hasPair(elements, symbol)) {
      defensivePosition = triangle[elements.indexOf(null)];
    }
  });
  return defensivePosition;
};

TTT.prototype.valid = function (pos) {
  function isInRange (pos) {
    return (0 <= pos) && (pos < 3);
  }

  return _(pos).all(isInRange) && _.isNull(this.board[pos[0]][pos[1]]);
};

TTT.prototype.verticalWinner = function () {
  var game = this;

  var winner = null;
  _(["X", "O"]).each(function (mark) {
    var indices = _.range(0, 3);

    var won = _(indices).any(function (j) {
      return _(indices).every(function (i) {
        return game.board[i][j] === mark;
      });
    });

    if (won) {
      winner = mark;
    }
  });

  return winner;
};

TTT.prototype.winnableLine = function (symbol) {
  var game = this;

  var horizontalWin, verticalWin, diagonalWin;

  game.rows().forEach(function (row, index) {
    if (game.hasOne(row, symbol)) {
      horizontalWin = [index, row.indexOf(null)];
    }
  });

  game.columns().forEach(function (column, index) {
    if (game.hasOne(column, symbol)) {
      verticalWin = [column.indexOf(null), index];
    }
  });

  game.diagonals().forEach(function (diagonal, index) {
    if (game.hasOne(diagonal, symbol) && index === 0) {
      diagonalWin = [diagonal.indexOf(null), diagonal.indexOf(null)];
    } else if (game.hasOne(diagonal, symbol) && index === 1) {
      diagonalWin = [diagonal.indexOf(null), 2 - diagonal.indexOf(null)];
    }
  })

  return (horizontalWin || verticalWin || diagonalWin);
};


TTT.prototype.winner = function() {
  return (
    this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
  );
};

TTT.prototype.winningMove = function (symbol) {
  var game = this;

  var horizontalWin, verticalWin, diagonalWin;

  game.rows().forEach(function (row, index) {
    if (game.hasPair(row, symbol)) {
      horizontalWin = [index, row.indexOf(null)];
    }
  });

  game.columns().forEach(function (column, index) {
    if (game.hasPair(column, symbol)) {
      verticalWin = [column.indexOf(null), index];
    }
  });

  game.diagonals().forEach(function (diagonal, index) {
    if (game.hasPair(diagonal, symbol) && index === 0) {
      diagonalWin = [diagonal.indexOf(null), diagonal.indexOf(null)];
    } else if (game.hasPair(diagonal, symbol) && index === 1) {
      diagonalWin = [diagonal.indexOf(null), 2 - diagonal.indexOf(null)];
    }
  })

  return (horizontalWin || verticalWin || diagonalWin);
};

Array.prototype.sumWith = function (row, col) {
  return [this[0] + row, this[1] + col];
};
