import { Edit2, Trash2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const ContactTable = ({ contacts, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Phone</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Company</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Created</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contacts.map((contact) => (
            <tr
              key={contact._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-gray-900">{contact.name}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{contact.email}</td>
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                {contact.phone || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                {contact.company || '—'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={contact.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                {formatDate(contact.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(contact)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(contact)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
