
const main = (() => {

  const mulberry32 = (a) => {
    return () => {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }
  

  const fillBlockColumn = (column) => {
    const height = column.getBoundingClientRect().height;
    const colSeed = parseInt(column.dataset.seed);

    const rng = mulberry32(((colSeed / 9999999)*2**32)>>>0);

    const blockHeight = 5;
    const blocks = Math.ceil(height / blockHeight) + 1;
    for (let i = 0; i < blocks; i++) {
      const block = document.createElement('div');
      block.classList.add('col-block', 'c' + (Math.floor(rng() * 5) + 1).toString());
      if (rng() < 0.03) {
        block.classList.add('highlight');
      }
      column.appendChild(block);
    }
  };

  const pad = (s, l) => {
    while (s.length < l) {
      s += '0';
    }
    return s;
  };

  const fillNumbers = (el, i) => {
    const rows = 100;
    const cols = 30;

    const rng = mulberry32((((4827342 + i) / 9999999)*2**32)>>>0);

    for (let c = 0; c < cols; c++) {
      const col = document.createElement('div');
      col.classList.add('ncol');
      col.classList.add('n' + (Math.floor(rng() * 4) + 1))
      for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.classList.add('num');
        if (rng() < 0.5) {
          row.classList.add('fade' + (Math.floor(rng() * 4) + 1));
        } else {
          row.classList.add('fade0');
        }
        row.innerText = pad('0.' + Math.floor(rng() * 10000), 6);
        col.appendChild(row);
      }
      el.appendChild(col);
    }
  };

  return () => {
    document.querySelectorAll('.block-col-container').forEach(fillBlockColumn);

    const numbers = document.getElementById('numbers');
    fillNumbers(numbers, 0);

    let counter = 0;
    const interval = setInterval(() => {
      counter += 1;
      if (counter >= 10) {
        clearInterval(interval);
      }

      const rng = mulberry32((((4827342 + counter) / 9999999)*2**32)>>>0);

      document.querySelectorAll('.num').forEach(el => {
        let n = 0;
        for (let i = 0; i <= 4; i++) {
          if (el.classList.contains('fade' + i)) {
            n = i;
            break;
          }
        }
        el.classList.remove('fade' + n);
        if ((counter < 6 || n > 0) && rng() < 0.5) {
          n = (n + 1) % 5;
        }
        el.classList.add('fade' + n);
        if (rng() < 0.75) {
          el.innerText = pad('0.' + Math.floor(rng() * 10000), 6);
        }
      });
    }, 400);

    setTimeout(() => document.body.classList.add('start'));
  };
})();
