document.write("<p>yo</p>")

const a = Object.assign(document.createElement('p'), { id: 'test', textContent: 'salut' });
document.body.appendChild(a);