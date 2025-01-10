import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InventoryList } from '../../../src/components/inventory/InventoryList';
import { useInventoryStore } from '@/store/store';
import '@testing-library/jest-dom';

// Mock zustand store
jest.mock('@/store/store', () => ({
  useInventoryStore: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <button {...props}>{children}</button>,
    h3: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => 
      <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockItems = [
  {
    id: 1,
    name: 'Test Item',
    description: 'Test Description',
    quantity: 10,
    price: 99.99,
    image_url: '/test-image.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockStore = {
  items: mockItems,
  fetchInventory: jest.fn(),
  updateInventoryItem: jest.fn(),
  deleteInventoryItem: jest.fn(),
};

describe('InventoryList', () => {
  beforeEach(() => {
    (useInventoryStore as jest.Mock).mockImplementation(() => mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders inventory items', () => {
    render(<InventoryList />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Qty: 10')).toBeInTheDocument();
    expect(screen.getByText('£ 99.99')).toBeInTheDocument();
  });

  it('handles edit mode', async () => {
    render(<InventoryList />);
    
    fireEvent.click(screen.getByText('Edit'));
    
    // Check if edit form is displayed
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

//   it('handles item update', async () => {
//     const updateInventoryItem = jest.fn().mockResolvedValue({});
//     (useInventoryStore as jest.Mock).mockImplementation(() => ({
//       ...mockStore,
//       updateInventoryItem,
//     }));

//     render(<InventoryList />);
    
//     fireEvent.click(screen.getByText('Edit'));
    
//     const descriptionInput = screen.getByDisplayValue('Test Description');
//     fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    
//     fireEvent.click(screen.getByText('Save'));
    
//     await waitFor(() => {
//       expect(updateInventoryItem).toHaveBeenCalledWith(1, {
//         description: 'Updated Description',
//       });
//     });
//   });

  it('handles item deletion', async () => {
    const deleteInventoryItem = jest.fn().mockResolvedValue({});
    (useInventoryStore as jest.Mock).mockImplementation(() => ({
      ...mockStore,
      deleteInventoryItem,
    }));

    render(<InventoryList />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => {
      expect(deleteInventoryItem).toHaveBeenCalledWith(1);
    });
  });

  it('displays success feedback after update', async () => {
    render(<InventoryList />);
    
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Item updated successfully!')).toBeInTheDocument();
    });
  });
});