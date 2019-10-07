(function () {
    class Square {

        constructor({initialX, initialY, width, speed, alpha, parent, color, minimumSize}) {
            this.speed = speed;
            this.alpha = alpha;
            this.width = width;

            this.el = document.createElement('div');
            this.el.style.width = width + 'px';
            this.el.style.height = width + 'px';
            this.el.style.background = color;
            this.minimumSize = minimumSize;

            this.parent = parent;
            parent.append(this.el);

            this.el.style.left = initialX + 'px';
            this.el.style.top = initialY + 'px';
            this.el.style.position = "absolute";
        }

        static getColors() {
            return [
                '#97f08d',
                '#4846f0',
                '#f0a1ec',
                '#f02543',
                '#e7f055',
                '#1af000',
                '#00e8f0',
                '#f00039',
                '#eef0ed',
                '#000000',
                '#8c7414',
                '#79dd3a',
            ]
        }

        setXPosition(x) {
            this.el.style.left = `${this.el.getBoundingClientRect().x + x}px`;
        }

        setYPosition(y) {
            this.el.style.top = `${this.el.getBoundingClientRect().y + y}px`;
        }

        setXAbsolute(x) {
            this.el.style.left = `${x}px`;
        }

        setYAbsolute(y) {
            this.el.style.top = `${y}px`;
        }

        /**
         * растояние, на которое нужно передвинуть объект
         * @param speed
         * @param time
         * @param alpha
         * @returns {*}
         */
        static getDiff(speed, time, alpha) {
            let diff = {},
                alphaDist = Math.round(Math.sqrt((Math.pow(speed * time, 2)) / 2));

            switch (alpha) {
                case 0:
                case 360:
                    diff.y = -1 * speed * time;
                    diff.x = 0;
                    break;
                case 45:
                    diff.x = -1 * alphaDist;
                    diff.y = alphaDist;
                    break;
                case 90:
                    diff.x = speed * time;
                    diff.y = 0;
                    break;
                case 135:
                    diff.x = alphaDist;
                    diff.y = alphaDist;
                    break;
                case 180:
                    diff.x = 0;
                    diff.y = speed * time;
                    break;
                case 225:
                    diff.x = -1 * alphaDist;
                    diff.y = alphaDist;
                    break;
                case 270:
                    diff.x = -1 * speed * time;
                    diff.y = 0;
                    break;
                case 315:
                    diff.x = -1 * alphaDist;
                    diff.y = -1 * alphaDist;
                    break;
            }

            return diff;
        }

        /**
         * двигать недвижимое
         * @param time
         */
        move(time) {
            let diff = Square.getDiff(this.speed, time, this.alpha);
            this.setXPosition(diff.x);
            this.setYPosition(diff.y);
        }

        /**
         * true если квдараты пресекаются
         * @param sq1
         * @param sq2
         * @returns {boolean}
         */
        static isCrossingSquares(sq1 = {x, y, width}, sq2 = {x, y, width}) {

            let crossX = sq1.x >= sq2.x && sq1.x <= sq2.x + sq2.width
                || sq1.x + sq1.width >= sq2.x && sq1.x + sq1.width <= sq2.x + sq2.width;

            let crossY = sq1.y >= sq2.y && sq1.y <= sq2.y + sq2.width
                || sq1.y + sq1.width >= sq2.y && sq1.y + sq1.width <= sq2.y + sq2.width;


            return crossX && crossY;
        }


        /**
         * рассчитать столкновение с другими квадратами
         */
        calcSquareBreak(squares) {
            for (let i = 0; i < squares.length; i++) {
                let sq = squares[i];
                if (this === sq) {
                    continue;
                }

                let sq1 = this.el.getBoundingClientRect(),
                    sq2 = sq.el.getBoundingClientRect();

                if (Square.isCrossingSquares({x: sq1.x, y: sq1.y, width: sq1.width}, {
                    x: sq2.x,
                    y: sq2.y,
                    width: sq2.width
                })) {


                    this.explode(squares);
                    sq.explode(squares);
                }
            }
        }

        /**
         * уничтожить квадрат, если возможно создать новых два
         * @param squares
         */
        explode(squares) {
            let index;
            for (let i = 0; i < squares.length; i++) {
                index = this === squares[i] ? i : index;
            }

            if (index !== undefined) {
                squares.splice(index, 1);
                let properties = this.el.getBoundingClientRect();
                let newWidth = Math.floor(properties.width / 2);

                let newAlphas = {};
                let newCoord = {
                    sq1: {},
                    sq2: {},
                };

                //  dirty dirty dirty cheat
                switch (this.alpha) {
                    case 0:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x;
                        newCoord.sq2.x = properties.x + 3;

                        newAlphas.x1 = 225;
                        newAlphas.x2 = 135;
                        break;
                    case 45:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x - 1;
                        newCoord.sq2.x = properties.x - 1;

                        newAlphas.x1 = 270;
                        newAlphas.x2 = 180;
                        break;
                    case 90:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x - 1;
                        newCoord.sq2.x = properties.x - 1;


                        newAlphas.x1 = 315;
                        newAlphas.x2 = 225;
                        break;
                    case 135:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x - 1;
                        newCoord.sq2.x = properties.x - 1;

                        newAlphas.x1 = 0;
                        newAlphas.x2 = 270;
                        break;
                    case 180:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y - 1;

                        newCoord.sq1.x = properties.x - 1;
                        newCoord.sq2.x = properties.x + newWidth + 3;


                        newAlphas.x1 = 45;
                        newAlphas.x2 = 315;
                        break;
                    case 225:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x + newWidth;
                        newCoord.sq2.x = properties.x + newWidth;


                        newAlphas.x1 = 90;
                        newAlphas.x2 = 0;
                        break;
                    case 270:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x + newWidth;
                        newCoord.sq2.x = properties.x + newWidth;


                        newAlphas.x1 = 135;
                        newAlphas.x2 = 45;
                        break;
                    case 315:
                        newCoord.sq1.y = properties.y;
                        newCoord.sq2.y = properties.y + newWidth + 3;

                        newCoord.sq1.x = properties.x + newWidth;
                        newCoord.sq2.x = properties.x + newWidth;

                        newAlphas.x1 = 180;
                        newAlphas.x2 = 90;
                        break;
                }

                this.el.remove();

                if (newWidth > this.minimumSize) {
                    squares.push(
                        new Square({
                            initialX: newCoord.sq1.x,
                            initialY: newCoord.sq1.y,
                            width: newWidth,
                            speed: Square.randomInt(50, 200),
                            alpha: newAlphas.x1,
                            parent: this.parent,
                            color: Square.randomRow(Square.getColors()),
                            minimumSize: this.minimumSize
                        })
                    );

                    squares.push(
                        new Square({
                            initialX: newCoord.sq2.x,
                            initialY: newCoord.sq2.y,
                            width: newWidth,
                            speed: Square.randomInt(50, 200),
                            alpha: newAlphas.x2,
                            parent: this.parent,
                            color: Square.randomRow(Square.getColors()),
                            minimumSize: this.minimumSize
                        })
                    );
                }

            }


        }

        /**
         * расчитать столкновение с экраном
         */
        calcAlphaScreenBreak() {
            let x, y; // точки квадрата, которые будем сопоставлять с экраном
            let domCoord = this.el.getBoundingClientRect(),
                parentCoord = this.parent.getBoundingClientRect();

            //debugger
            switch (this.alpha) {
                case 0:
                    x = domCoord.x;
                    y = domCoord.y;
                    break;

                case 45:
                    x = domCoord.x + this.width;
                    y = domCoord.y;
                    break;

                case 90:
                    x = domCoord.x + this.width;
                    y = domCoord.y;
                    break;

                case 135:
                    x = domCoord.x + this.width;
                    y = domCoord.y + this.width;
                    break;

                case 180:
                    x = domCoord.x + this.width;
                    y = domCoord.y + this.width;
                    break;

                case 225:
                    x = domCoord.x;
                    y = domCoord.y + this.width;
                    break;

                case 270:
                    x = domCoord.x;
                    y = domCoord.y + this.width;
                    break;

                case 315:
                    x = domCoord.x;
                    y = domCoord.y;
                    break;
            }

            if (x <= 0 || y <= 0 || x >= parentCoord.width || y >= parentCoord.height) {
                // сменить угол
                this.alpha = this.alpha + 180 + 45 * Square.randomRow([-1, 1]);
                if (this.alpha >= 360) {
                    this.alpha -= 360;
                }
            }

            if (x < 0) {
                this.setXAbsolute(1);
            }

            if (y < 0) {
                this.setYAbsolute(1);
            }

            if (x > parentCoord.width) {
                this.setXAbsolute(parentCoord.width - this.width - 1);
            }

            if (y > parentCoord.height) {
                this.setYAbsolute(parentCoord.height - this.width - 1);
            }
        }

        static randomRow(arr) {
            return arr[Square.randomInt(0, arr.length - 1)]
        }

        static randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        static getAlphas() {
            return [0, 45, 90, 135, 180, 225, 270, 315];
        }
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    document.addEventListener("DOMContentLoaded", function () {
        let cells = [];

        let initialPage = document.getElementById('init-page'),
            gamePage = document.getElementById('game-page');


        document.getElementById('btn-play').onclick = function () {


            let gamePageProperty = gamePage.getBoundingClientRect();


            let squareCount = parseInt(document.getElementById('input-initial-count').value),
                squareInitialSize = parseInt(document.getElementById('input-initial-size').value),
                squareMinimumSize = parseInt(document.getElementById('input-minimum-size').value);
            if (isNaN(squareCount) || isNaN(squareInitialSize) || isNaN(squareMinimumSize) || squareInitialSize < squareMinimumSize) {
                return alert('проверьте введенные значения');
            }

            initialPage.style.display = 'none';
            gamePage.style.display = 'block';

            // разбить игровое поле на ячейки

            let squareWithBorderSize = squareInitialSize + 5;
            for (let x = squareWithBorderSize; x < gamePageProperty.width - squareWithBorderSize; x += squareWithBorderSize) {
                for (let y = squareWithBorderSize; y < gamePageProperty.height - squareWithBorderSize; y += squareWithBorderSize) {
                    cells.push({
                        x, y
                    })
                }
            }

            // если квадратов больше чем свободного места
            if (squareCount >= cells.length) {
                return alert(`недостаточно места для ${squareCount} блоков`);
            }

            // раставить рандомно блоки
            shuffle(cells);
            let squares = [];
            for (let i = 0; i < squareCount; i++) {
                // инициализация блока с координатой cells[i]
                squares.push(
                    new Square({
                        initialX: cells[i].x,
                        initialY: cells[i].y,
                        width: squareInitialSize,
                        speed: Square.randomInt(50, 200),
                        alpha: Square.randomRow(Square.getAlphas()),
                        parent: gamePage,
                        color: Square.randomRow(Square.getColors()),
                        minimumSize: squareMinimumSize
                    })
                );

            }

            // добавить новый квадрат на поле
            gamePage.onclick = function (ev) {
                squares.push(
                    new Square({
                        initialX: ev.clientX,
                        initialY: ev.clientY,
                        width: squareInitialSize,
                        speed: Square.randomInt(50, 200),
                        alpha: Square.randomRow(Square.getAlphas()),
                        parent: gamePage,
                        color: Square.randomRow(Square.getColors()),
                        minimumSize: squareMinimumSize,
                    })
                );
            };

            let frequency = 20,
                interval =
                    setInterval(function () {
                        // переместить
                        for (let i = 0; i < squares.length; i++) {
                            let sq = squares[i];
                            sq.move(frequency / 1000);
                        }

                        // расчитать столкновения с границей экрана
                        for (let i = 0; i < squares.length; i++) {
                            let sq = squares[i];
                            sq.calcAlphaScreenBreak();
                        }

                        // расчитать столконовение с границей других кубов
                        for (let i = 0; i < squares.length; i++) {
                            let sq = squares[i];
                            sq.calcSquareBreak(squares)
                        }

                        if (squares.length === 1) {
                            clearInterval(interval); // winner found
                        }

                    }, frequency);
        }

    });
})();
