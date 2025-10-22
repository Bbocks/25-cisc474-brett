//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';
import { rule } from 'postcss';

export default [...tanstackConfig, {
    rules: {
        "import/order": "off",
        "sort-imports": "off",
        "array-type": "off",
        "array/type": "off",
    }
}];
