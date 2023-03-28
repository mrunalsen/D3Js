// console.log(document.querySelector('p'));
const data = [10, 20, 30, 40, 50];
const el = d3.select('ul').selectAll('li');
el.data(data)
    .join(
        enter => {
            return enter.append('li');
            // .style('color', 'red');
        },
        update => update.style('color', 'green'),
        exit => exit.remove()
    )
    .text((d) => d);
console.log(el);