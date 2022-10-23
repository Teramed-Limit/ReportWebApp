import { Field } from './field';

export interface ImageField extends Field {
    imageSource: ImageSource;
}

export interface ImageSource {
    type: 'base64' | 'url';
}
