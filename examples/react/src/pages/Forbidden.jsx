import React from 'react';
import BasicLayout from '../components/layout/BasicLayout';

export default function Forbidden() {
  return (
      <BasicLayout>
        <p>You have attempted to access something you don't have access to</p>

      </BasicLayout>
  );
}