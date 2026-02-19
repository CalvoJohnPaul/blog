import {serializeCacheKeys} from '~/utils/serializeCacheKeys';

export default function Page() {
  console.log(
    serializeCacheKeys([
      'hello',
      {
        prop1: 'value1',
        prop2: 'value2',
        some: {
          nestedprop1: 'value1',
          nestedprop2: 'value2',
        },
      },
      false,
      null,
    ]),
  );

  return null;
}
