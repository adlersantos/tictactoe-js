function render(game) {
  for (var i = 0; i < 3; i++) {
    var rowID = "#row" + i;
    var row = $(rowID);
    row.empty();
    for (var j = 0; j < 3; j++) {
      var character = game.board[i][j] || "";
      var divString = "<div id='" + i + '_' + j + "' class='square'>"
                      + character + "</div>";
      row.append(divString);
    }
    row.append('<div style="clear:both;"></div>');
  }
}

$(document).ready(function() {
  var game = new TTT();

  render(game);

  $('div.row').on('click', 'div.square', function(event) {
    var coordinates = $(this).attr('id').split("_");

    if (game.valid(coordinates)) {
      game.placeMark(coordinates);
      game.switchPlayer();

      if (!game.boardFull() && !game.winner()) {
        var positionAI = game.calculateAIMove();
        game.placeMark(positionAI);
        game.switchPlayer();
      }
    }

    render(game);

    if (game.winner()) {
      alert("Computer wins!");
      game = new TTT();
      render(game);
    }

    if (game.boardFull()) {
      alert("It's a draw.")
      game = new TTT();
      render(game);
    }
  });
});