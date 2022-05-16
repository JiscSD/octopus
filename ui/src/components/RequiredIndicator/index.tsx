import React from 'react';

const RequiredIndicator: React.FC = (): React.ReactElement => (
    <span title="required" aria-label="required" className="text-red-500">
        *
    </span>
);

export default RequiredIndicator;
