const codeGen : (() => string) = () => {
	function randomString(length : number, chars : string) {
		let result : string = "";
		for (let i : number = length; i > 0; --i)
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}

	return randomString(
		6,
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	);
};

export default codeGen;
