import { FormInstance } from 'antd';

export interface QuestionTypeFormProps {
	form: FormInstance;
	t: (key: string) => string;
	handleMultiLinePaste?: (
		e: React.ClipboardEvent<HTMLInputElement>,
		currentIndex: number,
		add: (defaultValue?: object, insertIndex?: number) => void,
		idPrefix: string,
		currentFieldsLength: number
	) => void;
}
