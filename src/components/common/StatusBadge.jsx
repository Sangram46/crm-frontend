const StatusBadge = ({ status }) => {
  const badgeClasses = {
    Lead: 'badge-lead',
    Prospect: 'badge-prospect',
    Customer: 'badge-customer',
  };

  return (
    <span className={`badge ${badgeClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
