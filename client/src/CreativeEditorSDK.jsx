import CreativeEditorSDK from '@cesdk/cesdk-js';

import { useEffect, useRef, useState } from 'react';

// configure CreativeEditor SDK
const config = {
  license: 'lo5R3tPsl4VJWQklCyqqxZvl3I-b3lpt1ZQoY7XJKPXdQTt9R57aegMcf4BZ6e6K', // replace it with a valid CE.SDL license key
  userId: 'guides-user',
  ui: {
    elements: {
      view: 'default',
      /* ... */
      navigation: {
        show: true, // 'false' to hide the navigation completely
        position: 'top', // 'top' or 'bottom'
        action: {
          close: true, // true or false
          back: true, // true or false
          load: true, // true or false
          save: true, // true or false
          export: {
            show: true,
            format: ['application/pdf'],
          },
          download: true, // true  or false
          /* ... */
        },
      },
      panels: {
        /* ... */
      },
      dock: {
        /* ... */
      },
      libraries: {
        /* ... */
      },
      blocks: {
        /* ... */
      },
    },
  },
  callbacks: { onUpload: 'local' }, // enable local file uploads in the Asset Library
};

export function CreativeEditorSDKComponent() {
  // reference to the container HTML element where CESDK will be initialized
  const cesdk_container = useRef(null);
  // define a state variable to keep track of the CESDK instance
  const [cesdk, setCesdk] = useState(null);

  useEffect(() => {
    // prevent initialization if the container element is not available yet
    if (!cesdk_container.current) {
      return;
    }

    // flag to keep track of the component unmount
    let cleanedUp = false;
    // where to store the local CE.SDK instance
    let instance;

    // initialize the CreativeEditorSDK instance in the container HTML element
    // using the given config
    CreativeEditorSDK.create(cesdk_container.current, config).then(
      async _instance => {
        // assign the current CD.SDK instance to the local variable
        instance = _instance;

        if (cleanedUp) {
          instance.dispose();
          return;
        }

        // do something with the instance of CreativeEditor SDK (e.g.,  populate
        // the asset library with default / demo asset sources)
        await Promise.all([
          instance.addDefaultAssetSources(),
          instance.addDemoAssetSources({ sceneMode: 'Design' }),
        ]);

        // create a new design scene in the editor
        await instance.createDesignScene();

        // store the CESDK instance in state
        setCesdk(instance);
      },
    );

    // cleanup function to dispose of the CESDK instance when the component unmounts
    const cleanup = () => {
      // clear the local state and dispose of the CS.SDK instance (if it has been assigned)
      cleanedUp = true;
      instance?.dispose();
      setCesdk(null);
    };

    // to ensure cleanup runs when the component unmounts
    return cleanup;
  }, [cesdk_container]);

  return (
    // the container HTML element where the CESDK editor will be mounted
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}