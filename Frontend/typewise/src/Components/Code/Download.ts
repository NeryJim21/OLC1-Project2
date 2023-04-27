export function download(nombre:string, text:string){
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(text));
    element.setAttribute('download', nombre);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}