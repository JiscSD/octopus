import * as Components from '@components';
import { render, screen } from '@testing-library/react'

const MainText = <Components.PublicationCreationMainText/>

describe('MainText tests', () => {
    it('MainText renders correctly', () => {
      render(MainText)
      expect(screen.getByTestId('main-text')).toHaveTextContent('Your publication can be added via the main text editor')
    });
  
  });