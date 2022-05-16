const moveElementInArray = (arr, from, to) => {
	if (from === to)
		return arr;
	if (from < to)
		return [...arr.slice(0, from), ...arr.slice(from+1, to+1), arr[from], ...arr.slice(to+1, arr.length)];
	else
		return [...arr.slice(0, to), arr[from], ...arr.slice(to, from), ...arr.slice(from+1, arr.length)];
}

export default moveElementInArray