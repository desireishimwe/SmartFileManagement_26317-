import { FiBarChart2, FiDollarSign, FiDownload, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { SummaryCard } from '../../components/Cards/SummaryCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const reportTypes = [
  { title: 'Student Reports', icon: FiFileText, description: 'Enrollment, demographics, guardians, and class placement.' },
  { title: 'Attendance Reports', icon: FiBarChart2, description: 'Daily attendance summaries and absentee trends.' },
  { title: 'Financial Reports', icon: FiDollarSign, description: 'Payments, balances, fee summaries, and due accounts.' },
  { title: 'Academic Performance Reports', icon: FiTrendingUp, description: 'Marks, GPA, report cards, and performance analysis.' },
];

export function ReportsPage() {
  return (
    <div>
      <div className="page-heading">
        <div><h1>Reports Module</h1><p>Generate operational, financial, attendance, and academic reports.</p></div>
        <button className="btn btn-primary"><FiDownload className="me-2" /> Export All</button>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><SummaryCard title="Student Reports" value="12" note="This term" icon={FiFileText} variant="primary" /></div>
        <div className="col-md-3"><SummaryCard title="Attendance Reports" value="20" note="This month" icon={FiBarChart2} variant="success" /></div>
        <div className="col-md-3"><SummaryCard title="Financial Reports" value="8" note="Ready" icon={FiDollarSign} variant="warning" /></div>
        <div className="col-md-3"><SummaryCard title="Performance Reports" value="16" note="Generated" icon={FiTrendingUp} variant="info" /></div>
      </div>
      <div className="row g-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div className="col-md-6" key={report.title}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <Icon className="text-primary mb-3" size={28} />
                  <h2 className="h5">{report.title}</h2>
                  <p className="text-muted">{report.description}</p>
                  <button className="btn btn-outline-primary"><FiDownload className="me-2" /> Generate</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4"><LoadingSpinner label="Preparing analytics snapshots" /></div>
    </div>
  );
}
