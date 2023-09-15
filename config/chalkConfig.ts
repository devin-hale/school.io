import chalk, { ChalkInstance } from 'chalk';

interface ILogTypes {
	message: ChalkInstance;
	alert: ChalkInstance;
	warning: ChalkInstance;
	success: ChalkInstance;
}

const logTypes: ILogTypes = {
	message: chalk.white,
	alert: chalk.yellow,
	warning: chalk.red,
	success: chalk.green,
};

export default logTypes;
