import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q




class FlowRun(models.Model) :
	class Status(models.TextChoices) :
		ACTIVE = "active", "Active"
		COMPLETED = "completed", "Completed"
		CANCELLED = "cancelled", "Cancelled"
		FAILED = "failed", "Failed"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	flow_version = models.ForeignKey("flows.FlowVersion", on_delete = models.PROTECT, related_name = "runs")
	current_step = models.ForeignKey("flows.FlowStep", on_delete = models.PROTECT, related_name = "current_runs")
	title = models.CharField(max_length = 200)
	status = models.CharField(max_length = 20, choices = Status.choices, default = Status.ACTIVE)
	started_at = models.DateTimeField(auto_now_add = True)
	completed_at = models.DateTimeField(null = True, blank = True)
	updated_at = models.DateTimeField(auto_now = True)
	
	
	class Meta :
		ordering = [ "-started_at" ]
		constraints = [
			models.CheckConstraint(
				condition = Q(status = "completed", completed_at__isnull = False) | ~Q(status = "completed"),
				name = "completed_run_has_completed_at",
			),
		]
	
	
	def clean( self ) :
		if self.current_step_id and self.flow_version_id :
			if self.current_step.flow_version_id != self.flow_version_id :
				raise ValidationError("Current step does not belong to the run's flow version.")
	
	
	def __str__( self ) :
		return self.title


class RunFieldValue(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "field_values")
	field = models.ForeignKey("flows.FlowField", on_delete = models.PROTECT, related_name = "run_values")
	value = models.JSONField(null = True, blank = True)
	
	
	class Meta :
		constraints = [
			models.UniqueConstraint(fields = [ "run", "field" ], name = "unique_run_field_value"),
		]
	
	
	def clean( self ) :
		if self.run_id and self.field_id :
			if self.run.flow_version_id != self.field.flow_version_id :
				raise ValidationError("Field does not belong to the run's flow version.")


class Task(models.Model) :
	class Status(models.TextChoices) :
		PENDING = "pending", "Pending"
		IN_PROGRESS = "in_progress", "In Progress"
		COMPLETED = "completed", "Completed"
		CANCELLED = "cancelled", "Cancelled"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "tasks")
	step = models.ForeignKey("flows.FlowStep", on_delete = models.PROTECT, related_name = "tasks")
	title = models.CharField(max_length = 200)
	description = models.TextField(blank = True)
	status = models.CharField(max_length = 20, choices = Status.choices, default = Status.PENDING)
	due_at = models.DateTimeField(null = True, blank = True)
	completed_at = models.DateTimeField(null = True, blank = True)
	created_at = models.DateTimeField(auto_now_add = True)
	
	
	class Meta :
		ordering = [ "-created_at" ]
		constraints = [
			models.CheckConstraint(
				condition = Q(status = "completed", completed_at__isnull = False) | ~Q(status = "completed"),
				name = "completed_task_has_completed_at",
			),
		]
	
	
	def clean( self ) :
		if self.run_id and self.step_id :
			if self.run.flow_version_id != self.step.flow_version_id :
				raise ValidationError("Task step does not belong to the run's flow version.")


class Approval(models.Model) :
	class Status(models.TextChoices) :
		PENDING = "pending", "Pending"
		APPROVED = "approved", "Approved"
		REJECTED = "rejected", "Rejected"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "approvals")
	step = models.ForeignKey("flows.FlowStep", on_delete = models.PROTECT, related_name = "approvals")
	status = models.CharField(max_length = 20, choices = Status.choices, default = Status.PENDING)
	decision_comment = models.TextField(blank = True)
	decided_at = models.DateTimeField(null = True, blank = True)
	created_at = models.DateTimeField(auto_now_add = True)
	
	
	class Meta :
		ordering = [ "-created_at" ]
		constraints = [
			models.CheckConstraint(
				condition = Q(status = "pending", decided_at__isnull = True) | Q(status__in = [ "approved", "rejected" ], decided_at__isnull = False),
				name = "approval_decision_timestamp_consistency",
			),
		]
	
	
	def clean( self ) :
		if self.run_id and self.step_id :
			if self.run.flow_version_id != self.step.flow_version_id :
				raise ValidationError("Approval step does not belong to the run's flow version.")


class Activity(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "activities")
	actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.PROTECT, related_name = "woen_activities")
	event_type = models.CharField(max_length = 80)
	message = models.CharField(max_length = 500)
	metadata = models.JSONField(default = dict, blank = True)
	created_at = models.DateTimeField(auto_now_add = True)
	
	
	class Meta :
		ordering = [ "-created_at" ]
	
	
	def __str__( self ) :
		return self.message


class Comment(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "comments")
	author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.PROTECT, related_name = "woen_comments")
	body = models.TextField()
	created_at = models.DateTimeField(auto_now_add = True)
	
	
	class Meta :
		ordering = [ "created_at" ]


class Attachment(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	run = models.ForeignKey(FlowRun, on_delete = models.CASCADE, related_name = "attachments")
	uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.PROTECT, related_name = "woen_attachments")
	file = models.FileField(upload_to = "run-attachments/%Y/%m/%d/")
	original_name = models.CharField(max_length = 255)
	created_at = models.DateTimeField(auto_now_add = True)
