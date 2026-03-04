import { Edit2, Trash2, Mail, Phone, Building2, StickyNote } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Name & Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            <StatusBadge status={contact.status} />
          </div>

          {/* Details */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>

            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{contact.phone}</span>
              </div>
            )}

            {contact.company && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{contact.company}</span>
              </div>
            )}

            {contact.notes && (
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <StickyNote className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{contact.notes}</span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className="mt-3 text-xs text-gray-400">
            Added {formatDate(contact.createdAt)}
            {contact.updatedAt !== contact.createdAt && (
              <> &middot; Updated {formatDate(contact.updatedAt)}</>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="Edit contact"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
