/**
*解析url参数
*@example ?id=12345&a=b
*@return Object {id:12345,a:b}
*/
export function urlParse() {
	/*let url = window.location.search;*/
	let url = 'https://www.kuke99.com/order/checkout?goods_id=1506&type=3';	
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g
	let arr = url.match(reg);	
	//['?id=12345', '&a=b']
	if (arr){
		arr.forEach((item) => {	
			let tempArr = item.substring(1).split('=');			
			let key = decodeURIComponent(tempArr[0]);
			let val = decodeURIComponent(tempArr[1]);
			obj[key] = val;
		})
		return obj;
	}


}