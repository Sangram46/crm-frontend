import { useState, useEffect, useCallback } from 'react';
import { Activity, Filter } from 'lucide-react';
import { activityLogsAPI } from '../api/services';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...(actionFilter && { action: actionFilter }),
      };

      const { data } = await activityLogsAPI.getAll(params);
      setLogs(data.data.logs);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionStyles = (action) => {
    switch (action) {
      case 'CREATE':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'Created',
          dot: 'bg-green-500',
        };
      case 'UPDATE':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: 'Updated',
          dot: 'bg-blue-500',
        };
      case 'DELETE':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          label: 'Deleted',
          dot: 'bg-red-500',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: action,
          dot: 'bg-gray-500',
        };
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-500 mt-1">
            Track all contact add, edit, and delete events
          </p>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field w-auto text-sm"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Created</option>
            <option value="UPDATE">Updated</option>
            <option value="DELETE">Deleted</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <LoadingSpinner size="lg" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-16">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No activity yet</h3>
          <p className="text-gray-500 mt-1">
            Activity events will appear here when you add, edit, or delete contacts.
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          {/* Timeline */}
          <div className="divide-y divide-gray-100">
            {logs.map((log, index) => {
              const style = getActionStyles(log.action);
              const { date, time } = formatDateTime(log.createdAt);

              return (
                <div
                  key={log._id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-1">
                    <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                    {index < logs.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`badge ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {log.contactName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>

                    {/* Show changes for updates */}
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">Changes:</p>
                        {Object.entries(log.changes).map(([field, change]) => (
                          <div key={field} className="text-xs text-gray-600">
                            <span className="font-medium capitalize">{field}:</span>{' '}
                            <span className="text-red-500 line-through">{change.from || '(empty)'}</span>
                            {' → '}
                            <span className="text-green-600">{change.to || '(empty)'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1.5">
                      {date} at {time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ActivityLogsPage;
