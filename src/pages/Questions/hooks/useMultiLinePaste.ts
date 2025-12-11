import { FormInstance } from 'antd';
import React, { useCallback } from 'react';

export const useMultiLinePaste = (form: FormInstance) => {
	const handleMultiLinePaste = useCallback(
		(
			e: React.ClipboardEvent<HTMLInputElement>,
			currentIndex: number,
			add: (defaultValue?: object, insertIndex?: number) => void,
			idPrefix: string,
			_currentFieldsLength: number
		) => {
			const pastedText = e.clipboardData.getData('text');
			const lines = pastedText.split(/\r?\n/).filter((line) => line.trim() !== '');

			// Only handle multi-line paste
			if (lines.length > 1) {
				e.preventDefault();

				// Set the first line to the current input
				const currentOptions = form.getFieldValue(['content', 'options']) || [];
				const currentLeftItems = form.getFieldValue(['content', 'left_items']) || [];
				const currentRightItems = form.getFieldValue(['content', 'right_items']) || [];
				const currentItems = form.getFieldValue(['content', 'items']) || [];

				// Determine which list we're working with based on idPrefix
				let fieldPath: string[];
				let currentList: any[];

				if (idPrefix === 'L') {
					fieldPath = ['content', 'left_items'];
					currentList = [...currentLeftItems];
				} else if (idPrefix === 'R') {
					fieldPath = ['content', 'right_items'];
					currentList = [...currentRightItems];
				} else if (idPrefix === 'O') {
					fieldPath = ['content', 'items'];
					currentList = [...currentItems];
				} else {
					fieldPath = ['content', 'options'];
					currentList = [...currentOptions];
				}

				// Update current item with first line
				if (currentList[currentIndex]) {
					currentList[currentIndex] = {
						...currentList[currentIndex],
						text: lines[0].trim(),
					};
				}

				// Add remaining lines - first fill empty items below, then create new ones
				let lineIndex = 1;
				let nextItemIndex = currentIndex + 1;

				// First, fill empty items below the current one
				while (lineIndex < lines.length && nextItemIndex < currentList.length) {
					const item = currentList[nextItemIndex];
					// Check if this item is empty (no text or empty text)
					if (!item?.text || item.text.trim() === '') {
						currentList[nextItemIndex] = {
							...item,
							text: lines[lineIndex].trim(),
						};
						lineIndex++;
					}
					nextItemIndex++;
				}

				// Then, create new items for remaining lines
				for (let i = lineIndex; i < lines.length; i++) {
					const newIndex = currentList.length;
					let newItem: object;

					if (idPrefix === 'L' || idPrefix === 'R') {
						newItem = {
							id: `${idPrefix}${newIndex + 1}`,
							text: lines[i].trim(),
						};
					} else if (idPrefix === 'O') {
						newItem = {
							id: `${idPrefix}${newIndex + 1}`,
							text: lines[i].trim(),
						};
					} else {
						// Multiple choice
						newItem = {
							id: String.fromCharCode(65 + newIndex),
							text: lines[i].trim(),
							order: newIndex + 1,
						};
					}
					currentList.push(newItem);
				}

				form.setFieldValue(fieldPath, currentList);
			}
		},
		[form]
	);

	return { handleMultiLinePaste };
};
