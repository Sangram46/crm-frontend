import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';

describe('StatusBadge', () => {
  it('renders Lead badge correctly', () => {
    render(<StatusBadge status="Lead" />);
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Lead')).toHaveClass('badge-lead');
  });

  it('renders Prospect badge correctly', () => {
    render(<StatusBadge status="Prospect" />);
    expect(screen.getByText('Prospect')).toBeInTheDocument();
    expect(screen.getByText('Prospect')).toHaveClass('badge-prospect');
  });

  it('renders Customer badge correctly', () => {
    render(<StatusBadge status="Customer" />);
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toHaveClass('badge-customer');
  });
});

describe('Pagination', () => {
  const mockPagination = {
    page: 1,
    totalPages: 5,
    total: 50,
    limit: 10,
    hasNextPage: true,
    hasPrevPage: false,
  };

  it('renders pagination controls', () => {
    render(<Pagination pagination={mockPagination} onPageChange={() => {}} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination pagination={mockPagination} onPageChange={() => {}} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('enables next button when has next page', () => {
    render(<Pagination pagination={mockPagination} onPageChange={() => {}} />);
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('shows correct item range', () => {
    render(<Pagination pagination={mockPagination} onPageChange={() => {}} />);
    // Check the "Showing X to Y of Z results" text
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText(/results/)).toBeInTheDocument();
  });

  it('returns null when only one page', () => {
    const singlePage = { ...mockPagination, totalPages: 1 };
    const { container } = render(
      <Pagination pagination={singlePage} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });
});

describe('ConfirmDialog', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <ConfirmDialog
        isOpen={false}
        title="Test"
        message="Test message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Contact"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText('Delete Contact')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('shows cancel and confirm buttons', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test"
        onConfirm={() => {}}
        onCancel={() => {}}
        confirmText="Remove"
      />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});
