import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q




class Flow(models.Model) :
	class Status(models.TextChoices) :
		DRAFT = "draft", "Draft"
		PUBLISHED = "published", "Published"
		ARCHIVED = "archived", "Archived"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	workspace = models.ForeignKey("core.Workspace", on_delete = models.PROTECT, related_name = "flows")
	name = models.CharField(max_length = 160)
	slug = models.SlugField(max_length = 180)
	description = models.TextField(blank = True)
	status = models.CharField(max_length = 20, choices = Status.choices, default = Status.DRAFT)
	created_by = models.ForeignKey("auth.User", on_delete = models.PROTECT, related_name = "created_flows")
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	
	
	class Meta :
		ordering = [ "name" ]
		constraints = [
			models.UniqueConstraint(fields = [ "workspace", "slug" ], name = "unique_flow_slug_per_workspace"),
		]
	
	
	def __str__( self ) :
		return self.name


class FlowVersion(models.Model) :
	class Status(models.TextChoices) :
		DRAFT = "draft", "Draft"
		PUBLISHED = "published", "Published"
		ARCHIVED = "archived", "Archived"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	flow = models.ForeignKey(Flow, on_delete = models.CASCADE, related_name = "versions")
	version = models.PositiveIntegerField()
	status = models.CharField(max_length = 20, choices = Status.choices, default = Status.DRAFT)
	notes = models.TextField(blank = True)
	published_at = models.DateTimeField(null = True, blank = True)
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	
	
	class Meta :
		ordering = [ "-version" ]
		constraints = [
			models.UniqueConstraint(fields = [ "flow", "version" ], name = "unique_flow_version"),
			models.UniqueConstraint(fields = [ "flow" ], condition = Q(status = "draft"), name = "one_draft_version_per_flow"),
			models.UniqueConstraint(fields = [ "flow" ], condition = Q(status = "published"), name = "one_published_version_per_flow"),
		]
	
	
	def __str__( self ) :
		return f"{self.flow.name} v{self.version}"


class FlowField(models.Model) :
	class FieldType(models.TextChoices) :
		TEXT = "text", "Text"
		LONG_TEXT = "long_text", "Long Text"
		NUMBER = "number", "Number"
		BOOLEAN = "boolean", "Boolean"
		DATE = "date", "Date"
		DATETIME = "datetime", "DateTime"
		CHOICE = "choice", "Choice"
		URL = "url", "URL"
		FILE = "file", "File"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	flow_version = models.ForeignKey(FlowVersion, on_delete = models.CASCADE, related_name = "fields")
	key = models.SlugField(max_length = 100)
	label = models.CharField(max_length = 160)
	field_type = models.CharField(max_length = 20, choices = FieldType.choices)
	required = models.BooleanField(default = False)
	options = models.JSONField(default = list, blank = True)
	sort_order = models.PositiveIntegerField(default = 0)
	
	
	class Meta :
		ordering = [ "sort_order", "label" ]
		constraints = [
			models.UniqueConstraint(fields = [ "flow_version", "key" ], name = "unique_field_key_per_flow_version"),
		]
	
	
	def __str__( self ) :
		return self.label


class FlowStep(models.Model) :
	class StepType(models.TextChoices) :
		START = "start", "Start"
		TASK = "task", "Task"
		APPROVAL = "approval", "Approval"
		CONDITION = "condition", "Condition"
		END = "end", "End"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	flow_version = models.ForeignKey(FlowVersion, on_delete = models.CASCADE, related_name = "steps")
	name = models.CharField(max_length = 160)
	key = models.SlugField(max_length = 100)
	step_type = models.CharField(max_length = 20, choices = StepType.choices)
	description = models.TextField(blank = True)
	position_x = models.IntegerField(default = 0)
	position_y = models.IntegerField(default = 0)
	configuration = models.JSONField(default = dict, blank = True)
	
	
	class Meta :
		ordering = [ "name" ]
		constraints = [
			models.UniqueConstraint(fields = [ "flow_version", "key" ], name = "unique_step_key_per_flow_version"),
			models.UniqueConstraint(fields = [ "flow_version" ], condition = Q(step_type = "start"), name = "one_start_step_per_flow_version"),
		]
	
	
	def __str__( self ) :
		return self.name


class FlowTransition(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	source_step = models.ForeignKey(FlowStep, on_delete = models.CASCADE, related_name = "outgoing_transitions")
	target_step = models.ForeignKey(FlowStep, on_delete = models.CASCADE, related_name = "incoming_transitions")
	name = models.CharField(max_length = 160)
	priority = models.PositiveIntegerField(default = 0)
	
	
	class Meta :
		ordering = [ "priority", "name" ]
		constraints = [
			models.UniqueConstraint(fields = [ "source_step", "target_step", "name" ], name = "unique_transition"),
		]
	
	
	def clean( self ) :
		if self.source_step_id and self.target_step_id :
			if self.source_step.flow_version_id != self.target_step.flow_version_id :
				raise ValidationError("Source and target steps must belong to the same flow version.")
			
			if self.source_step_id == self.target_step_id :
				raise ValidationError("A transition cannot point to the same step.")
	
	
	def __str__( self ) :
		return self.name


class FlowRule(models.Model) :
	class Operator(models.TextChoices) :
		EQUALS = "equals", "Equals"
		NOT_EQUALS = "not_equals", "Not Equals"
		GREATER_THAN = "greater_than", "Greater Than"
		LESS_THAN = "less_than", "Less Than"
		GREATER_THAN_OR_EQUAL = "greater_than_or_equal", "Greater Than or Equal"
		LESS_THAN_OR_EQUAL = "less_than_or_equal", "Less Than or Equal"
		CONTAINS = "contains", "Contains"
		IS_EMPTY = "is_empty", "Is Empty"
		IS_NOT_EMPTY = "is_not_empty", "Is Not Empty"
	
	
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	transition = models.ForeignKey(FlowTransition, on_delete = models.CASCADE, related_name = "rules")
	field = models.ForeignKey(FlowField, on_delete = models.PROTECT, related_name = "rules")
	operator = models.CharField(max_length = 30, choices = Operator.choices)
	comparison_value = models.JSONField(null = True, blank = True)
	sort_order = models.PositiveIntegerField(default = 0)
	
	
	class Meta :
		ordering = [ "sort_order", "id" ]
	
	
	def clean( self ) :
		if self.transition_id and self.field_id :
			if self.transition.source_step.flow_version_id != self.field.flow_version_id :
				raise ValidationError("Rule field must belong to the same flow version as its transition.")
	
	
	def __str__( self ) :
		return f"{self.field.label} {self.operator}"
