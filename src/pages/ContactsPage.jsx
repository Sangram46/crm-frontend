import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, LayoutGrid, LayoutList } from 'lucide-react';
import { contactsAPI } from '../api/services';
import ContactForm from '../components/contacts/ContactForm';
import ContactCard from '../components/contacts/ContactCard';
import ContactTable from '../components/contacts/ContactTable';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ContactsPage = () => {
  // State
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, contact: null });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  // Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const { data } = await contactsAPI.getAll(params);
      setContacts(data.data.contacts);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handlers
  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await contactsAPI.create(formData);
      toast.success('Contact created successfully');
      setFormOpen(false);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create contact');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingContact) return;
    setFormLoading(true);
    try {
      await contactsAPI.update(editingContact._id, formData);
      toast.success('Contact updated successfully');
      setFormOpen(false);
      setEditingContact(null);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update contact');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.contact) return;
    setDeleteLoading(true);
    try {
      await contactsAPI.delete(deleteConfirm.contact._id);
      toast.success('Contact deleted successfully');
      setDeleteConfirm({ open: false, contact: null });
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete contact');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await contactsAPI.exportCSV(params);

      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Contacts exported successfully');
    } catch (error) {
      toast.error('Failed to export contacts');
    }
  };

  const openEditForm = (contact) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingContact(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500 mt-1">
            Manage your contacts and customer relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={openCreateForm}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by name or email..."
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2.5 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <LoadingSpinner size="lg" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {debouncedSearch || statusFilter ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            {debouncedSearch || statusFilter
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first contact'}
          </p>
          {!debouncedSearch && !statusFilter && (
            <button
              onClick={openCreateForm}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ContactTable
              contacts={contacts}
              onEdit={openEditForm}
              onDelete={(contact) =>
                setDeleteConfirm({ open: true, contact })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  onEdit={openEditForm}
                  onDelete={(contact) =>
                    setDeleteConfirm({ open: true, contact })
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={editingContact ? handleUpdate : handleCreate}
        contact={editingContact}
        isLoading={formLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Contact"
        message={`Are you sure you want to delete "${deleteConfirm.contact?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, contact: null })}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ContactsPage;
