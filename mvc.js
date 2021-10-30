class Event {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  trigger(params) {
    this.listeners.forEach(listener => {
      listener(params);
    });
  }
}

class Model {
  constructor() {
    this.board = Array(49).fill();
    this.currentPlayer = "black";
    this.finished = false;
    this.updateCellEvent = new Event();
    this.victoryEvent = new Event();
    this.drawEvent = new Event();
  }
  

  play(move) {
    if (this.finished || move < 0 || move > 48 || this.board[move]) {
      return false;
    }
    
    for (let i = 0; i < this.board.length; i++) {
      if(!this.board[move] && move < 42 && !this.board[move+7]) {
          move+=7;
      }
      else
      break          
    }
    
    this.board[move] = this.currentPlayer;
    this.updateCellEvent.trigger({ move, player: this.currentPlayer });
    
    this.finished = this.victory() || this.draw();
    
    if (!this.finished) {
        this.switchPlayer();
      }

    return true;
  }

  victory() {

    const lines = [
      [0, 1, 2, 3], [1, 2, 3, 4],[2, 3, 4, 5],[3, 4, 5, 6], //rows
      [7, 8, 9, 10],[8, 9, 10, 11],[9,10,11,12],[10,11,12,13],
      [14, 15, 16, 17],[15, 16, 17, 18],[16,17,18,19],[17,18,19,20],
      [21, 22, 23, 24],[22, 23, 24, 25],[26, 25, 24, 23],[24,25,26,27],
      [28, 29, 30, 31],[29, 30, 31, 32],[30,31,32,33],[31,32,33,34],
      [35, 36, 37, 38],[36, 37, 38, 39],[40, 39, 38, 37],[38,39,40,41],
      [42,43,44,45],[43,44,45,46],[44,45,46,47],[45,46,47,48],
  
      [0, 7, 14, 21],[7, 14, 21, 28],[14,21,28,35],[42, 35, 28, 21], //columns
      [1, 8, 15, 22],[8, 15, 22, 29],[15,22,29,36],[22,29,36,43], 
      [2, 9, 16, 23],[9, 16, 23, 30],[16,23,30,37],[23,30,37,44],
      [3, 10, 17, 24],[10, 17, 24, 31],[17,24,31,38],[24,31,38,45],
      [4, 11, 18, 25],[11, 18, 25, 32],[18,25,32,39],[25,32,39,46],
      [5, 12, 19, 26],[12, 19, 26, 33],[19,26,33,40],[26,33,40,47],
      [6, 13, 20, 27],[13, 20, 27, 34],[20, 27, 34, 41], [27, 34, 41, 48],
  
                                                                          //crosses 

      [0,8,16,24],[8,16,24,32],[40,32,24,16],[48,40,32,24],               //left big cross  
      [45, 37, 29, 21],[14, 22, 30, 38],[46, 38, 30, 22],[7, 15, 23, 31], //left sec crossess  
      [39, 31, 23, 15],[47, 39, 31, 23],[1, 9, 17, 25],[9, 17, 25, 33],
      [41, 33, 25, 17],[2, 10, 18, 26],[34, 26, 18, 10],[27, 19, 11, 3],
        
      [6,12,18,24],[12,18,24,30],[18,24,30,36],[24,30,36,42],             //right big cross 
      [45, 39, 33, 27],[20, 26, 32, 38],[44, 38, 32, 26],[13, 19, 25, 31],  //right sec crosses
      [37, 31, 25, 19],[43, 37, 31, 25],[5, 11, 17, 23],[11, 17, 23, 29],
      [35, 29, 23, 17],[4, 10, 16, 22],[28, 22, 16, 10],[21, 15, 9, 3],                                      
             ];

    const victory = lines.some(l => this.board[l[0]] && this.board[l[0]] === this.board[l[1]] && this.board[l[1]] === this.board[l[2]] && this.board[l[2]] === this.board[l[3]]);

    if (victory) {
      this.victoryEvent.trigger(this.currentPlayer);
    }

    return victory;
  }

  draw() {
    const draw = this.board.every(i => i);

    if (draw) {
      this.drawEvent.trigger();
    }

    return draw;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "black" ? "white" : "black";
  }
}